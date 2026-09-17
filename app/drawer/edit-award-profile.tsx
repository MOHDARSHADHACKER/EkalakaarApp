import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

// Define Award Type
interface Award {
  title: string;
  awardingBody: string;
  level: string;
  location: string;
  year: string;
  documentUrl: string;
  documentName: string;
}

const EditAwardProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Data
  const [totalAwards, setTotalAwards] = useState('');
  const [highestLevel, setHighestLevel] = useState('');
  const [highlights, setHighlights] = useState('');
  
  // Major Awards (Max 3)
  const [awards, setAwards] = useState<Award[]>([
    {
      title: '',
      awardingBody: '',
      level: '',
      location: '',
      year: '',
      documentUrl: '',
      documentName: '',
    },
  ]);

  // Dropdown Options
  const levels = ['International', 'National', 'State', 'District', 'Local'];
  const years = Array.from({ length: 2027 - 1950 + 1 }, (_, i) => (2027 - i).toString());
  
  const indianStates = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  const internationalCountries = [
    'Bangladesh',
    'Brazil',
    'China',
    'Colombia',
    'DR Congo',
    'Egypt',
    'Ethiopia',
    'France',
    'Germany',
    'India',
    'Indonesia',
    'Iran',
    'Italy',
    'Japan',
    'Mexico',
    'Myanmar',
    'Nigeria',
    'Pakistan',
    'Philippines',
    'Russia',
    'South Africa',
    'South Korea',
    'Spain',
    'Tanzania',
    'Thailand',
    'Turkey',
    'United Kingdom',
    'United States',
    'Vietnam',
  ];

  // Fetch existing award data
  useEffect(() => {
    fetchAwardData();
  }, []);

  const fetchAwardData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const res = await fetch('https://api.ekalakaar.com/api/v1/artists/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.data?.awardsInfo) {
        const { awardsInfo } = data.data;
        
        setTotalAwards(awardsInfo.totalAwards?.toString() || '');
        setHighestLevel(awardsInfo.level || '');
        setHighlights(awardsInfo.highlights || '');
        
        if (awardsInfo.awardsDetails && awardsInfo.awardsDetails.length > 0) {
          setAwards(awardsInfo.awardsDetails.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load award data');
    } finally {
      setLoading(false);
    }
  };

  // Handle Award Field Changes
  const handleAwardChange = (index: number, field: keyof Award, value: string) => {
    const updatedAwards = [...awards];
    updatedAwards[index][field] = value;
    setAwards(updatedAwards);
  };

  // Add New Award (Max 3)
  const addAward = () => {
    if (awards.length >= 3) {
      Alert.alert('Limit Reached', 'You can add maximum 3 major awards');
      return;
    }

    setAwards([
      ...awards,
      {
        title: '',
        awardingBody: '',
        level: '',
        location: '',
        year: '',
        documentUrl: '',
        documentName: '',
      },
    ]);
  };

  // Remove Award
  const removeAward = (index: number) => {
    if (awards.length === 1) {
      Alert.alert('Error', 'At least one award entry is required');
      return;
    }
    const updatedAwards = awards.filter((_, i) => i !== index);
    setAwards(updatedAwards);
  };

  // Document Picker
  const pickDocument = async (index: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      
      // Check file size (1 MB limit)
      if (asset.size && asset.size > 1024 * 1024) {
        Alert.alert('Error', 'File size must be less than 1 MB');
        return;
      }

      // Upload document
      await uploadDocument(index, asset);
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  // Upload Document
  const uploadDocument = async (index: number, file: any) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('documents', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as any);

      const res = await fetch(
        'https://api.ekalakaar.com/api/v1/artists/profile/award-documents/upload',
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
        handleAwardChange(index, 'documentUrl', data.images[0]);
        handleAwardChange(index, 'documentName', file.name);
        Alert.alert('Success', 'Document uploaded successfully');
      } else {
        Alert.alert('Error', data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  // Remove Document
  const removeDocument = (index: number) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            handleAwardChange(index, 'documentUrl', '');
            handleAwardChange(index, 'documentName', '');
          },
        },
      ]
    );
  };

  // Submit Form
  const handleSubmit = async () => {
    // Validation
    if (!totalAwards || !highestLevel) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate at least first award has data
    if (!awards[0].title || !awards[0].awardingBody) {
      Alert.alert('Error', 'Please fill in at least one major award');
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('accessToken');

      const awardsInfo = {
        totalAwards: parseInt(totalAwards),
        level: highestLevel,
        highlights: highlights,
        awardsDetails: awards.filter(
          (award) => award.title && award.awardingBody
        ),
      };

      const res = await fetch(
        'https://api.ekalakaar.com/api/v1/artists/profile',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ awardsInfo }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Award profile updated successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AWARD PROFILE</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Awards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Awards</Text>

          {/* Total Awards */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Total Awards<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={totalAwards}
                onValueChange={setTotalAwards}
                style={styles.picker}
              >
                <Picker.Item label="Select total awards" value="" />
                {Array.from({ length: 200 }, (_, i) => i + 1).map((num) => (
                  <Picker.Item key={num} label={num.toString()} value={num.toString()} />
                ))}
                <Picker.Item label="200+" value="200+" />
              </Picker>
            </View>
          </View>

          {/* Highest Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Highest Level of Awards<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={highestLevel}
                onValueChange={setHighestLevel}
                style={styles.picker}
              >
                <Picker.Item label="Select level" value="" />
                {levels.map((level) => (
                  <Picker.Item key={level} label={level} value={level} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Major Awards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Major Award</Text>
            <TouchableOpacity onPress={addAward} style={styles.addButton}>
              <Ionicons name="add-circle" size={28} color="#b91c1c" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Add Major Awards (Max. 3)</Text>

          {awards.map((award, index) => (
            <View key={index} style={styles.awardCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Award {index + 1}</Text>
                {awards.length > 1 && (
                  <TouchableOpacity onPress={() => removeAward(index)}>
                    <Ionicons name="trash-outline" size={20} color="#b91c1c" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Award Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name Of Award</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Dance Therapy"
                  value={award.title}
                  onChangeText={(val) => handleAwardChange(index, 'title', val)}
                />
              </View>

              {/* Awarding Body */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Awarding Body</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rajshree Institute"
                  value={award.awardingBody}
                  onChangeText={(val) => handleAwardChange(index, 'awardingBody', val)}
                />
              </View>

              {/* Level */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Level</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={award.level}
                    onValueChange={(val) => handleAwardChange(index, 'level', val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select level" value="" />
                    {levels.map((level) => (
                      <Picker.Item key={level} label={level} value={level} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={award.location}
                    onValueChange={(val) => handleAwardChange(index, 'location', val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select location" value="" />
                    {(award.level === 'International'
                      ? internationalCountries
                      : indianStates
                    ).map((loc) => (
                      <Picker.Item key={loc} label={loc} value={loc} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Year */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Year</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={award.year}
                    onValueChange={(val) => handleAwardChange(index, 'year', val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select year" value="" />
                    {years.map((year) => (
                      <Picker.Item key={year} label={year} value={year} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Document Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Certificate</Text>
                {award.documentUrl ? (
                  <View style={styles.documentPreview}>
                    <View style={styles.documentInfo}>
                      <Ionicons name="document-attach" size={20} color="#b91c1c" />
                      <View style={styles.documentTextContainer}>
                        <Text style={styles.documentName} numberOfLines={1}>
                          {award.documentName || 'Document uploaded'}
                        </Text>
                        <TouchableOpacity 
                          onPress={() => {
                            // Open document in browser/viewer
                            const documentUrl = award.documentUrl.startsWith('http') 
                              ? award.documentUrl 
                              : `https://api.ekalakaar.com/images/${award.documentUrl}`;
                            
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
                                    } catch (error) {
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
                    <TouchableOpacity onPress={() => removeDocument(index)}>
                      <Ionicons name="close-circle" size={24} color="#b91c1c" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => pickDocument(index)}
                  >
                    <Ionicons name="cloud-upload-outline" size={24} color="#666" />
                    <Text style={styles.uploadText}>Upload Certificate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Highlights of awards (if any)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mention awards highlights..."
              value={highlights}
              onChangeText={setHighlights}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#b91c1c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  awardCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b91c1c',
  },
  addButton: {
    padding: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: 20,
    backgroundColor: '#fafafa',
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
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
  viewLink: {
    fontSize: 12,
    color: '#b91c1c',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: '#b91c1c',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditAwardProfile;