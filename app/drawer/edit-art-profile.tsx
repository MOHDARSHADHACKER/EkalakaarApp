import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Dance = [    "Bharatanatyam",
    "Bihu",
    "Chhau",
    "Dandiya Raas",
    "Dollu Kunitha",
    "Dumhal",
    "Garba",
    "Gaur Dance",
    "Giddha",
    "Gotipua",
    "Jhumar",
    "Kacchi Ghodi",
    "Kalbelia",
    "Karakattam",
    "Kathak",
    "Kathakali",
    "Kathakar",
    "Koli",
    "Kuchipudi",
    "Lavani",
    "Manipuri",
    "Mayurbhanj Chhau",
    "Mohiniyattam",
    "Odissi",
    "Raas Leela",
    "Sattriya",
    "Tamasha",
    "Tera Tali",
    "Thang-Ta",
    "Yakshagana",
    "Any Other"];
const Song = ["Dhrupad",
    "Khayal",
    "Thumri",
    "Tappa",
    "Ghazal",
    "Qawwali",
    "Kriti",
    "Varnam",
    "Tillana",
    "Ragamalika",
    "Javali",
    "Swarajati",
    "Bhajans",
    "Kirtan",
    "Sufi Music",
    "Abhangas",
    "Shabad Kirtan (Sikh)",
    "Any Other"];
const Theatre = [ "Bhavai",
    "Bhand Pather",
    "Jatra",
    "Koodiyattam",
    "Mudiyettu",
    "Nautanki",
    "Pandavani",
    "Pothu Koothu",
    "Ramlila",
    "Ram Lila",
    "Ras Leela",
    "Sattriya",
    "Tamaasha",
    "Therukoothu",
    "Yakshagana",
    "Any Other"];
const Music = ["Bansuri", "Sitar", "Tabla", "Harmonium", "Any Other","Ektara","Esraj",
    "Flute (Bansuri)",
    "Ghatam",
    "Harmonium",
    "Jal Tarang",
    "Mridangam",
    "Nadaswaram",
    "Pakhawaj",
    "Ravanahatha",
    "Sarangi",
    "Sarod",
    "Santoor",
    "Shehnai",
    "Sitar",
    "Tabla",
    "Tanpura",
    "Tumbi",
    "Veena",
    "Any Other"];
const artdata = { Dance, Song, Theatre, Music };
const categoryOfArt = ["Dance", "Song", "Theatre", "Music"];
const typeOfArt = ["Traditional", "Contemporary", "Fusion", "Folk", "Classical"];
const indian_states = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const years = Array.from({ length: 81 }, (_, i) => (1950 + i).toString());
const months = Array.from({ length: 24 }, (_, i) => (i + 1).toString());

const EditArtProfile = ({ navigation }: { navigation?: any }) => {
  const router = useRouter(); // ALWAYS INSIDE COMPONENT, TOP-LEVEL!

  const [loading, setLoading] = useState<boolean>(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState<boolean>(false);
  const [showTraditionalModal, setShowTraditionalModal] = useState<boolean>(false);

  const [artInfoFormData, setArtInfoFormData] = useState<{
    aboutArt: string;
    artCategory: string[];
    artEducation: string;
    artName: string[];
    artType: string[];
  }>({
    aboutArt: "",
    artCategory: [],
    artEducation: "",
    artName: [],
    artType: []
  });

  const [professionalTable, setProfessionalTable] = useState<Array<{
    course: string; specialization: string; institute: string; duration: string;
    completionYear: string; documentUrl: string;
  }>>([
    { course: "", specialization: "", institute: "", duration: "", completionYear: "", documentUrl: "" }
  ]);
  const [traditionalTable, setTraditionalTable] = useState<Array<{
    artName: string; guruName: string; location: string; duration: string;
    completionYear: string; documentUrl: string;
  }>>([
    { artName: "", guruName: "", location: "", duration: "", completionYear: "", documentUrl: "" }
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableArtNames, setAvailableArtNames] = useState<string[]>([]);
  const [selectedArtNames, setSelectedArtNames] = useState<string[]>([]);
  const [selectedArtTypes, setSelectedArtTypes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setAvailableArtNames([]); return;
    }
    const newArtNames = selectedCategories.flatMap(
      category => artdata[category as keyof typeof artdata] || []
    );
    setAvailableArtNames(newArtNames);
  }, [selectedCategories]);

  useEffect(() => { fetchProfileData(); }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        setLoading(false); return;
      }
      const response = await fetch('https://api.ekalakaar.com/api/v1/artists/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.data?.artInfo) {
        setArtInfoFormData({
          aboutArt: data.data.artInfo.aboutArt || "",
          artCategory: data.data.artInfo.artCategory || [],
          artEducation: data.data.artInfo.artEducation || "",
          artName: data.data.artInfo.artName || [],
          artType: data.data.artInfo.artType || []
        });
        setSelectedCategories(data.data.artInfo.artCategory || []);
        setSelectedArtNames(data.data.artInfo.artName || []);
        setSelectedArtTypes(data.data.artInfo.artType || []);
        if (data.data.professionalInfo) setProfessionalTable(data.data.professionalInfo);
        if (data.data.traditionalInfo) setTraditionalTable(data.data.traditionalInfo);
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile data');
      }
    } catch {
      Alert.alert('Error', 'Failed to load profile data');
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const artInfo = {
        aboutArt: artInfoFormData.aboutArt,
        artCategory: selectedCategories,
        artEducation: artInfoFormData.artEducation,
        artName: selectedArtNames,
        artType: selectedArtTypes
      };
      const professionalInfo = professionalTable.filter(row => row.course && row.institute);
      const traditionalInfo = traditionalTable.filter(row => row.artName && row.guruName);
      const response = await fetch('https://api.ekalakaar.com/api/v1/artists/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ artInfo, professionalInfo, traditionalInfo })
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    } finally { setLoading(false); }
  };

  // --- DOCUMENT UPLOAD (PROFESSIONAL/TRADITIONAL) ---
  const handleDocumentPick = async (tableType: 'professional' | 'traditional', index: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if (file.size && file.size > 1024 * 1024) {
        Alert.alert('Error', 'File size must be less than 1 MB'); return;
      }
      await uploadDocument(tableType, index, file);
    } catch {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadDocument = async (tableType: 'professional' | 'traditional', index: number, file: any) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('documents', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as any);
      const res = await fetch(
        'https://api.ekalakaar.com/api/v1/artists/profile/art-documents/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok && data.images && data.images[0]) {
        if (tableType === 'professional') {
          const updated = [...professionalTable];
          updated[index].documentUrl = data.images[0];
          setProfessionalTable(updated);
        } else {
          const updated = [...traditionalTable];
          updated[index].documentUrl = data.images[0];
          setTraditionalTable(updated);
        }
        Alert.alert('Success', 'Document uploaded successfully');
      } else {
        Alert.alert('Error', data.message || 'Upload failed');
      }
    } catch {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const removeDocument = (tableType: 'professional' | 'traditional', index: number) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (tableType === 'professional') {
              const updated = [...professionalTable];
              updated[index].documentUrl = '';
              setProfessionalTable(updated);
            } else {
              const updated = [...traditionalTable];
              updated[index].documentUrl = '';
              setTraditionalTable(updated);
            }
          },
        },
      ]
    );
  };

  const addProfessionalRow = () => {
    setProfessionalTable([...professionalTable, {
      course: "", specialization: "", institute: "", duration: "",
      completionYear: "", documentUrl: ""
    }]);
  };
  const removeProfessionalRow = (index: number) => {
    if (professionalTable.length > 1) {
      setProfessionalTable(professionalTable.filter((_, i) => i !== index));
    }
  };
  const addTraditionalRow = () => {
    setTraditionalTable([...traditionalTable, {
      artName: "", guruName: "", location: "", duration: "",
      completionYear: "", documentUrl: ""
    }]);
  };
  const removeTraditionalRow = (index: number) => {
    if (traditionalTable.length > 1) {
      setTraditionalTable(traditionalTable.filter((_, i) => i !== index));
    }
  };

  // Toggles
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  const toggleArtName = (artName: string) => {
    if (selectedArtNames.includes(artName)) {
      setSelectedArtNames(selectedArtNames.filter(a => a !== artName));
    } else {
      setSelectedArtNames([...selectedArtNames, artName]);
    }
  };
  const toggleArtType = (artType: string) => {
    if (selectedArtTypes.includes(artType)) {
      setSelectedArtTypes(selectedArtTypes.filter(a => a !== artType));
    } else {
      setSelectedArtTypes([...selectedArtTypes, artType]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#AD2F3B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
       <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Art PROFILE</Text>
              <View style={{ width: 24 }} />
            </View>

      {/* Category of Art */}
     <View style={styles.section}>
  <Text style={styles.label}>Category of Art*</Text>
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedCategories[0] || ""}
      onValueChange={value => setSelectedCategories([value])}
      style={styles.picker}
    >
      <Picker.Item label="Select category" value="" />
      {categoryOfArt.map(category => (
        <Picker.Item key={category} label={category} value={category} />
      ))}
    </Picker>
  </View>
</View>


      {/* Name of Art */}
      {availableArtNames.length > 0 && (
       <View style={styles.section}>
  <Text style={styles.label}>Name of Art*</Text>
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedArtNames[0] || ""}
      onValueChange={value => setSelectedArtNames([value])}
      style={styles.picker}
    >
      <Picker.Item label="Select art name" value="" />
      {availableArtNames.map(artName => (
        <Picker.Item key={artName} label={artName} value={artName} />
      ))}
    </Picker>
  </View>
</View>

      )}

      {/* Types of Art */}
     <View style={styles.section}>
  <Text style={styles.label}>Types of Art</Text>
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedArtTypes[0] || ""}
      onValueChange={value => setSelectedArtTypes([value])}
      style={styles.picker}
    >
      <Picker.Item label="Select type" value="" />
      {typeOfArt.map(type => (
        <Picker.Item key={type} label={type} value={type} />
      ))}
    </Picker>
  </View>
</View>


      {/* Art Education */}
      <View style={styles.section}>
        <Text style={styles.label}>Art Education</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={artInfoFormData.artEducation}
            onValueChange={(value) =>
              setArtInfoFormData({ ...artInfoFormData, artEducation: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Traditional" value="Traditional" />
            <Picker.Item label="Professional" value="Professional" />
            <Picker.Item label="Both" value="Both" />
          </Picker>
        </View>
      </View>

      {/* Professional Art Education Button */}
      {(artInfoFormData.artEducation === "Professional" || 
        artInfoFormData.artEducation === "Both") && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowProfessionalModal(true)}
        >
          <Text style={styles.addButtonText}>
            Professional Art Education
          </Text>
          <View style={styles.addIcon}>
            <Text style={styles.addIconText}>+</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Traditional Art Education Button */}
      {(artInfoFormData.artEducation === "Traditional" || 
        artInfoFormData.artEducation === "Both") && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowTraditionalModal(true)}
        >
          <Text style={styles.addButtonText}>
            Traditional Art Education
          </Text>
          <View style={styles.addIcon}>
            <Text style={styles.addIconText}>+</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* About the Art */}
      <View style={styles.section}>
        <Text style={styles.label}>About The Art</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          value={artInfoFormData.aboutArt}
          onChangeText={(text) =>
            setArtInfoFormData({ ...artInfoFormData, aboutArt: text })
          }
          placeholder="Write a short description of your art"
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>

      {/* Professional Education Modal */}
      <Modal
        visible={showProfessionalModal}
        animationType="slide"
        transparent={false}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProfessionalModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Professional Art Education</Text>
          </View>

          <Text style={styles.modalSubtitle}>
            Fill Out All the details Correctly
          </Text>

          {professionalTable.map((row, index) => (
            <View key={index} style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name of Course</Text>
                <TextInput
                  style={styles.input}
                  value={row.course}
                  onChangeText={(text) => {
                    const updated = [...professionalTable];
                    updated[index].course = text;
                    setProfessionalTable(updated);
                  }}
                  placeholder="Choose the name of your course"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Specialization</Text>
                <TextInput
                  style={styles.input}
                  value={row.specialization}
                  onChangeText={(text) => {
                    const updated = [...professionalTable];
                    updated[index].specialization = text;
                    setProfessionalTable(updated);
                  }}
                  placeholder="Choose your specialization"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name of Institute</Text>
                <TextInput
                  style={styles.input}
                  value={row.institute}
                  onChangeText={(text) => {
                    const updated = [...professionalTable];
                    updated[index].institute = text;
                    setProfessionalTable(updated);
                  }}
                  placeholder="Type the name of the institute"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (Months)</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={row.duration}
                    onValueChange={(value) => {
                      const updated = [...professionalTable];
                      updated[index].duration = value;
                      setProfessionalTable(updated);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {months.map(m => (
                      <Picker.Item key={m} label={m.toString()} value={m.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Year of Completion</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={row.completionYear}
                    onValueChange={(value) => {
                      const updated = [...professionalTable];
                      updated[index].completionYear = value;
                      setProfessionalTable(updated);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {years.map(y => (
                      <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

                      <View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Upload Your Certificate (Optional)</Text>
  <TouchableOpacity
    style={styles.uploadButton}
    onPress={() => handleDocumentPick('professional', index)}
  >
    <Text style={styles.uploadText}>Click to upload</Text>
        </TouchableOpacity>
                       {row.documentUrl ? (
    <View style={styles.documentPreview}>
      <View style={styles.documentInfo}>
        <Ionicons name="document-attach" size={20} color="#b91c1c" />
        <View style={styles.documentTextContainer}>
          <Text style={styles.documentName} numberOfLines={1}>
            {row.documentUrl.split('/').pop() || 'Document uploaded'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const documentUrl = row.documentUrl.startsWith('http')
                ? row.documentUrl
                : `https://api.ekalakaar.com/images/${row.documentUrl}`;
              Alert.alert(
                'View Certificate',
                'Open certificate in browser?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'View',
                    onPress: async () => {
                      try {
                        const { Linking } = await import('react-native');
                        await Linking.openURL(documentUrl);
                      } catch {
                        Alert.alert('Error', 'Could not open document');
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.viewLink}>Click to view</Text>
          </TouchableOpacity>
        </View>
      </View>
               <TouchableOpacity onPress={() => removeDocument('professional', index)}>
                <Ionicons name="close-circle" size={24} color="#b91c1c" />
               </TouchableOpacity>
                         </View>
                      ) : null}
                         </View>

              {professionalTable.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeProfessionalRow(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={addProfessionalRow}
          >
            <Text style={styles.addMoreText}>+ Add More</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setShowProfessionalModal(false)}
          >
            <Text style={styles.submitButtonText}>Submitted</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Traditional Education Modal */}
      <Modal
        visible={showTraditionalModal}
        animationType="slide"
        transparent={false}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTraditionalModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Traditional Art Education</Text>
          </View>

          <Text style={styles.modalSubtitle}>
            Fill Out All the details Correctly
          </Text>

          {traditionalTable.map((row, index) => (
            <View key={index} style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name of Art</Text>
                <TextInput
                  style={styles.input}
                  value={row.artName}
                  onChangeText={(text) => {
                    const updated = [...traditionalTable];
                    updated[index].artName = text;
                    setTraditionalTable(updated);
                  }}
                  placeholder="Choose the name of art"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name of Guru</Text>
                <TextInput
                  style={styles.input}
                  value={row.guruName}
                  onChangeText={(text) => {
                    const updated = [...traditionalTable];
                    updated[index].guruName = text;
                    setTraditionalTable(updated);
                  }}
                  placeholder="Enter guru name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location (City/District)</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={row.location}
                    onValueChange={(value) => {
                      const updated = [...traditionalTable];
                      updated[index].location = value;
                      setTraditionalTable(updated);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {indian_states.map(state => (
                      <Picker.Item key={state} label={state} value={state} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (Months)</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={row.duration}
                    onValueChange={(value) => {
                      const updated = [...traditionalTable];
                      updated[index].duration = value;
                      setTraditionalTable(updated);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {months.map(m => (
                      <Picker.Item key={m} label={m.toString()} value={m.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Year of Completion</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={row.completionYear}
                    onValueChange={(value) => {
                      const updated = [...traditionalTable];
                      updated[index].completionYear = value;
                      setTraditionalTable(updated);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {years.map(y => (
                      <Picker.Item key={y} label={y.toString()} value={y.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Upload Your Certificate (Optional)</Text>
  <TouchableOpacity
    style={styles.uploadButton}
    onPress={() => handleDocumentPick('traditional', index)}
  >
    <Text style={styles.uploadText}>Click to upload</Text>
  </TouchableOpacity>
  {row.documentUrl ? (
    <View style={styles.documentPreview}>
      <View style={styles.documentInfo}>
        <Ionicons name="document-attach" size={20} color="#b91c1c" />
        <View style={styles.documentTextContainer}>
          <Text style={styles.documentName} numberOfLines={1}>
            {row.documentUrl.split('/').pop() || 'Document uploaded'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const documentUrl = row.documentUrl.startsWith('http')
                ? row.documentUrl
                : `https://api.ekalakaar.com/images/${row.documentUrl}`;
              Alert.alert(
                'View Certificate',
                'Open certificate in browser?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'View',
                    onPress: async () => {
                      try {
                        const { Linking } = await import('react-native');
                        await Linking.openURL(documentUrl);
                      } catch {
                        Alert.alert('Error', 'Could not open document');
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.viewLink}>Click to view</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeDocument('traditional', index)}>
        <Ionicons name="close-circle" size={24} color="#b91c1c" />
      </TouchableOpacity>
    </View>
  ) : null}
</View>


              {traditionalTable.length > 1 && (
                 <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeTraditionalRow(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={addTraditionalRow}
          >
            <Text style={styles.addMoreText}>+ Add More</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setShowTraditionalModal(false)}
          >
            <Text style={styles.submitButtonText}>Submitted</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingTop: 50,
  },
  backButton: {
    fontSize: 24,
    marginRight: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  section: {
    padding: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },

    viewLink: {
    fontSize: 12,
    color: '#b91c1c',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  chipSelected: {
    backgroundColor: '#AD2F3B',
    borderColor: '#AD2F3B'
  },
  chipText: {
    color: '#333',
    fontSize: 14
  },
  chipTextSelected: {
    color: '#fff'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5'
  },
  addButtonText: {
    color: '#AD2F3B',
    fontWeight: '600',
    fontSize: 14
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#AD2F3B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top'
  },
  updateButton: {
    backgroundColor: '#AD2F3B',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  closeButton: {
    fontSize: 24,
    marginRight: 16,
    color: '#333'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AD2F3B'
  },
  modalSubtitle: {
    padding: 16,
    color: '#999',
    fontSize: 12
  },
  formCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 8
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#FFE5E5',
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFF9F9'
  },
  uploadText: {
    color: '#AD2F3B',
    fontSize: 14
  },

  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#b91c1c',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff5f5',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },


  fileName: {
    marginTop: 8,
    fontSize: 12,
    color: '#666'
  },
  removeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#AD2F3B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  removeButtonText: {
    color: '#AD2F3B',
    fontWeight: '600'
  },
  addMoreButton: {
    margin: 16,
    padding: 16,
    alignItems: 'center'
  },
  addMoreText: {
    color: '#AD2F3B',
    fontWeight: '600',
    fontSize: 16
  },
  submitButton: {
    backgroundColor: '#AD2F3B',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default EditArtProfile;