import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Type definitions
type PerfDetail = {
  eventName: string;
  duration: string;
  level: string;
  location: string;
  collaborator: string;
};

type Production = {
  nameOfProductions: string;
  briefOfPerformance: string;
  approxBudget: string;
  sample: string;
};

export default function EditPerformanceProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [performanceImages, setPerformanceImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Performance form state
  const [formData, setFormData] = useState({
    affiliatedToAnyGroup: false,
    nameOfArtistGroupOrg: '',
    locationOfGroupOrg: '',
    contactNumber: '',
    countryCode: '+91',
    typeOfPerformance: '',
    highestLevelOfPerformance: '',
    totalPerfs: '',
    experience: '',
    avgPerfDurationIn: '',
    avgPerfFeeIn: '',
    avgPerfDurationInternational: '',
    avgPerfFeeInternational: '',
    aboutJourney: '',
  });

  // Performance details table (top 3 performances)
  const [perfDetails, setPerfDetails] = useState<PerfDetail[]>([
    { eventName: '', duration: '', level: '', location: '', collaborator: '' },
    { eventName: '', duration: '', level: '', location: '', collaborator: '' },
    { eventName: '', duration: '', level: '', location: '', collaborator: '' },
  ]);

  // Production info
  const [existingProduction, setExistingProduction] = useState(false);
  const [productions, setProductions] = useState<Production[]>([
    { nameOfProductions: '', briefOfPerformance: '', approxBudget: '', sample: '' },
  ]);

  // Performance videos
  const [perfVideos, setPerfVideos] = useState(['', '', '']);

  // Fetch profile data
  useEffect(() => {
    fetchPerformanceData();
  }, []);

const fetchPerformanceData = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('accessToken');

    const response = await fetch('https://api.ekalakaar.com/api/v1/artists/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok && data.data?.performanceInfo) {
      const perfInfo = data.data.performanceInfo;

         setFormData({
          affiliatedToAnyGroup: perfInfo.affiliation?.isAffiliated || false,
          nameOfArtistGroupOrg: perfInfo.affiliation?.name || '',
          locationOfGroupOrg: perfInfo.affiliation?.location || '',
          contactNumber: perfInfo.affiliation?.contactNumber?.number || '',
          countryCode: perfInfo.affiliation?.contactNumber?.countryCode || '+91',
          typeOfPerformance: perfInfo.perfType || '',
          highestLevelOfPerformance: perfInfo.peakPerf || '',
          totalPerfs: perfInfo.totalPerfs?.toString() || '',
          experience: perfInfo.experience?.toString() || '',
          avgPerfDurationIn: perfInfo.perfDuration?.india || '',
          avgPerfFeeIn: perfInfo.perfCharge?.india || '',
          avgPerfDurationInternational: perfInfo.perfDuration?.international || '',
          avgPerfFeeInternational: perfInfo.perfCharge?.international || '',
          aboutJourney: perfInfo.highlights || '',
        });// as before

      if (perfInfo.perfDetails && perfInfo.perfDetails.length > 0) {
        setPerfDetails(perfInfo.perfDetails.slice(0, 3));
      }

      if (perfInfo.performances && perfInfo.performances.length > 0) {
        setExistingProduction(true);
        setProductions(perfInfo.performances);
      }

      if (perfInfo.perfVideos) {
        setPerfVideos([
          perfInfo.perfVideos[0] || '',
          perfInfo.perfVideos[1] || '',
          perfInfo.perfVideos[2] || '',
        ]);
      }

      // **THIS IS THE KEY FIX:**
      if (perfInfo.perfImgs && Array.isArray(perfInfo.perfImgs)) {
        setPerformanceImages(
  (perfInfo.perfImgs as string[]).filter((img: string) => !!img)
);

      } else {
        setPerformanceImages([]);
      }
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    Alert.alert('Error', 'Failed to load performance data');
  } finally {
    setLoading(false);
  }
};


  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('accessToken');

      const performanceInfo = {
        affiliation: {
          name: formData.nameOfArtistGroupOrg,
          isAffiliated: formData.affiliatedToAnyGroup,
          location: formData.locationOfGroupOrg,
          contactNumber: {
            countryCode: formData.countryCode,
            number: formData.contactNumber,
          },
        },
        perfDuration: {
          india: formData.avgPerfDurationIn,
          international: formData.avgPerfDurationInternational,
        },
        perfCharge: {
          india: formData.avgPerfFeeIn,
          international: formData.avgPerfFeeInternational,
        },
        perfType: formData.typeOfPerformance,
        experience: parseInt(formData.experience) || 0,
        highlights: formData.aboutJourney,
        totalPerfs: parseInt(formData.totalPerfs) || 0,
        peakPerf: formData.highestLevelOfPerformance,
        perfDetails: perfDetails,
        perfVideos: perfVideos.filter((url) => url.trim() !== ''),
        performances: existingProduction ? productions : [],
      };

      const response = await fetch('https://api.ekalakaar.com/api/v1/artists/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ performanceInfo }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Performance profile updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Save Error:', error);
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const updatePerfDetail = (index: number, field: keyof PerfDetail, value: string) => {
    const updated = [...perfDetails];
    updated[index][field] = value;
    setPerfDetails(updated);
  };

  const addProduction = () => {
    setProductions([
      ...productions,
      { nameOfProductions: '', briefOfPerformance: '', approxBudget: '', sample: '' },
    ]);
  };

  const removeProduction = (index: number) => {
    const updated = productions.filter((_, i) => i !== index);
    setProductions(
      updated.length > 0
        ? updated
        : [{ nameOfProductions: '', briefOfPerformance: '', approxBudget: '', sample: '' }]
    );
  };

  const updateProduction = (index: number, field: keyof Production, value: string) => {
    const updated = [...productions];
    updated[index][field] = value;
    setProductions(updated);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }



  
// Pick and upload image(s)
const pickPerformanceImages = async () => {
  if (performanceImages.length >= 5) {
    Alert.alert('Maximum Images', 'You can upload up to 5 images only');
    return;
  }
  const limit = 5 - performanceImages.length;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
    selectionLimit: limit,
  });
  if (!result.canceled) {
    uploadPerformanceImages(result.assets);
  }
};

const uploadPerformanceImages = async (assets: any[]) => {
  try {
    setUploadingImages(true);

    const token = await AsyncStorage.getItem('accessToken');
    console.log('Upload: Access token:', token);

    for (const asset of assets) {
      console.log('Uploading asset:', asset.uri);
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const sizeKB = blob.size / 1024;
      console.log(`Asset ${asset.uri} size: ${sizeKB} KB`);

      if (sizeKB > 1024) {
        Alert.alert('File Too Large', 'Each image must be under 1 MB');
        setUploadingImages(false);
        return;
      }
    }

    const formData = new FormData();
    for (const asset of assets) {
      const uriParts = asset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('images', {
        uri: asset.uri,
        name: `performance_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    // Log FormData details
    // (Note: You can't directly log FormData, but you can log appended data)
    console.log('Upload FormData appended:', assets.map(a => a.uri));

    // Make sure endpoint is correct
    const uploadUrl = 'https://api.ekalakaar.com/api/v1/artists/profile/perf-images';
    console.log('Uploading to:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);

    const data = await response.json();
    console.log('Upload response JSON:', data);

    if (response.ok && data.data?.performanceInfo?.perfImgs) {
      setPerformanceImages(data.data.performanceInfo.perfImgs);
      Alert.alert('Success', 'Images uploaded successfully');
    } else {
      Alert.alert('Error', data.message || 'Upload failed');
    }
  } catch (e) {
    Alert.alert('Error', 'Failed to upload images');
    console.error('Upload exception:', e);
  } finally {
    setUploadingImages(false);
  }
};


// Remove image from server and state
const handleRemovePerformanceImage = async (index: number) => {
  try {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const token = await AsyncStorage.getItem('accessToken');
            const updatedImages = performanceImages.filter((_, i) => i !== index);
            const response = await fetch(
              'https://api.ekalakaar.com/api/v1/artists/profile',
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  performanceInfo: {
                    perfImgs: updatedImages,
                  },
                }),
              }
            );
            if (response.ok) {
              setPerformanceImages(updatedImages);
              Alert.alert('Success', 'Image removed successfully');
            } else {
              Alert.alert('Error', 'Failed to remove image');
            }
          },
        },
      ]
    );
  } catch (e) {
    console.error('Remove Error:', e);
    Alert.alert('Error', 'Failed to remove image');
  }
};

// Utility for full URL (your backend logic)
const getFullImageUrl = (imageValue: string) => {
  if (!imageValue) return '';
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
    return imageValue;
  }
  return `https://api.ekalakaar.com/images/${imageValue}`;
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Performance Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Affiliation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affiliation Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Affiliated To Any Group/Organization</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.affiliatedToAnyGroup.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, affiliatedToAnyGroup: value === 'true' })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Yes" value="true" />
                <Picker.Item label="No" value="false" />
              </Picker>
            </View>
          </View>

          {formData.affiliatedToAnyGroup && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name Of Artist Group/Organization</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nameOfArtistGroupOrg}
                  onChangeText={(text) =>
                    setFormData({ ...formData, nameOfArtistGroupOrg: text })
                  }
                  placeholder="Enter group name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location of Group/Organization</Text>
                <TextInput
                  style={styles.input}
                  value={formData.locationOfGroupOrg}
                  onChangeText={(text) =>
                    setFormData({ ...formData, locationOfGroupOrg: text })
                  }
                  placeholder="Enter location"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Number</Text>
                <View style={styles.phoneContainer}>
                  <TextInput
                    style={[styles.input, styles.countryCode]}
                    value={formData.countryCode}
                    editable={false}
                  />
                  <TextInput
                    style={[styles.input, styles.phoneNumber]}
                    value={formData.contactNumber}
                    onChangeText={(text) =>
                      setFormData({ ...formData, contactNumber: text })
                    }
                    placeholder="1234567890"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type of Performance</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.typeOfPerformance}
                    onValueChange={(value) =>
                      setFormData({ ...formData, typeOfPerformance: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    <Picker.Item label="Solo" value="solo" />
                    <Picker.Item label="Group" value="group" />
                    <Picker.Item label="Both" value="both" />
                  </Picker>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Performance Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Highest Level of Performance</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.highestLevelOfPerformance}
                onValueChange={(value) =>
                  setFormData({ ...formData, highestLevelOfPerformance: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="International" value="International" />
                <Picker.Item label="National" value="National" />
                <Picker.Item label="State" value="State" />
                <Picker.Item label="District" value="District" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Number of Performances</Text>
            <TextInput
              style={styles.input}
              value={formData.totalPerfs}
              onChangeText={(text) => setFormData({ ...formData, totalPerfs: text })}
              placeholder="Enter total performances"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={formData.experience}
              onChangeText={(text) => setFormData({ ...formData, experience: text })}
              placeholder="Enter years"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Duration and Fees Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration & Fees (India)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Average Duration</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.avgPerfDurationIn}
                onValueChange={(value) =>
                  setFormData({ ...formData, avgPerfDurationIn: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="< 10 Minutes" value="<10min" />
                <Picker.Item label="10 Minutes" value="10min" />
                <Picker.Item label="10-30 Minutes" value="10-30min" />
                <Picker.Item label="30-60 Minutes" value="30-60min" />
                <Picker.Item label="60-120 Minutes" value="60-120min" />
                <Picker.Item label="> 120 Minutes" value=">120min" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Average Fee</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.avgPerfFeeIn}
                onValueChange={(value) =>
                  setFormData({ ...formData, avgPerfFeeIn: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="< Rs 5000" value="<5000" />
                <Picker.Item label="Rs 5000 - Rs 10000" value="5000-10000" />
                <Picker.Item label="Rs 10000 - Rs 20000" value="10000-20000" />
                <Picker.Item label="Rs 20000 - Rs 50000" value="20000-50000" />
                <Picker.Item label="Rs 50000 - Rs 100000" value="50000-100000" />
                <Picker.Item label="> Rs 100000" value=">100000" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration & Fees (International)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Average Duration</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.avgPerfDurationInternational}
                onValueChange={(value) =>
                  setFormData({ ...formData, avgPerfDurationInternational: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="< 30 Minutes" value="<30min" />
                <Picker.Item label="30-60 Minutes" value="30-60min" />
                <Picker.Item label="60-120 Minutes" value="60-120min" />
                <Picker.Item label="> 120 Minutes" value=">120min" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Average Fee</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.avgPerfFeeInternational}
                onValueChange={(value) =>
                  setFormData({ ...formData, avgPerfFeeInternational: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="< Rs 25000" value="<25000" />
                <Picker.Item label="Rs 25000 - Rs 50000" value="25000-50000" />
                <Picker.Item label="Rs 50000 - Rs 100000" value="50000-100000" />
                <Picker.Item label="Rs 100000 - Rs 250000" value="100000-250000" />
                <Picker.Item label="> Rs 250000" value=">250000" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Major Performances Section */}
       <View style={styles.section}>
  <Text style={styles.sectionTitle}>Major Performances (Max 3)</Text>
  {perfDetails.map((perf, index) => (
    <View key={index} style={styles.perfCard}>
      <Text style={styles.perfCardTitle}>Performance {index + 1}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={perf.eventName}
          onChangeText={(text) => updatePerfDetail(index, 'eventName', text)}
          placeholder="Enter event name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duration (Hours)</Text>
        <TextInput
          style={styles.input}
          value={perf.duration}
          onChangeText={(text) => updatePerfDetail(index, 'duration', text)}
          placeholder="Enter duration in hours"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Level</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={perf.level}
            onValueChange={(value) => updatePerfDetail(index, 'level', value as string)}
            style={styles.picker}
          >
            <Picker.Item label="Select Level" value="" />
            <Picker.Item label="International" value="International" />
            <Picker.Item label="National" value="National" />
            <Picker.Item label="State" value="State" />
            <Picker.Item label="District" value="District" />
            <Picker.Item label="Local" value="Local" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={perf.location}
          onChangeText={(text) => updatePerfDetail(index, 'location', text)}
          placeholder="Enter location"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Partner/Organizer</Text>
        <TextInput
          style={styles.input}
          value={perf.collaborator}
          onChangeText={(text) => updatePerfDetail(index, 'collaborator', text)}
          placeholder="Enter partner or organizer name"
          placeholderTextColor="#999"
        />
      </View>
    </View>
  ))}
</View>


              <View style={styles.section}>
               <Text style={styles.sectionTitle}>Performance Images (Maximum uploads: 5 images)</Text>
               <TouchableOpacity
                                style={styles.uploadImageButton}
                                onPress={pickPerformanceImages}
    disabled={uploadingImages || performanceImages.length >= 5}
  >
    <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
    <Text style={styles.uploadImageButtonText}>
      {uploadingImages ? 'Uploading...' : 'Upload Performance Images'}
    </Text>
  </TouchableOpacity>
  <Text style={styles.imageHint}>Each image should be less than 1 MB</Text>
  {/* --- HORIZONTAL SCROLL FIX --- */}
  {performanceImages.length > 0 ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 12 }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={{ flexDirection: "row" }}>
        {performanceImages.filter(Boolean).map((imageUrl, index) => (
          <View key={index} style={styles.imageCard}>
            <Image
              source={{ uri: getFullImageUrl(imageUrl) }}
              style={styles.performanceImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => handleRemovePerformanceImage(index)}
            >
              <Ionicons name="close-circle" size={28} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  ) : (
    <View style={styles.noImagesContainer}>
      <Ionicons name="images-outline" size={48} color="#ccc" />
      <Text style={styles.noImagesText}>No images uploaded yet</Text>
    </View>
  )}
</View>




        {/* Existing Productions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existing Production</Text>
          <View style={styles.inputGroup}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={existingProduction.toString()}
                onValueChange={(value) => setExistingProduction(value === 'true')}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Yes" value="true" />
                <Picker.Item label="No" value="false" />
              </Picker>
            </View>
          </View>

          {existingProduction && (
            <>
              {productions.map((prod, index) => (
                <View key={index} style={styles.perfCard}>
                  <View style={styles.perfCardHeader}>
                    <Text style={styles.perfCardTitle}>Production {index + 1}</Text>
                    {productions.length > 1 && (
                      <TouchableOpacity onPress={() => removeProduction(index)}>
                        <Ionicons name="close-circle" size={24} color="#b91c1c" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <TextInput
                    style={styles.input}
                    value={prod.nameOfProductions}
                    onChangeText={(text) =>
                      updateProduction(index, 'nameOfProductions', text)
                    }
                    placeholder="Name of Production"
                  />

                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={prod.briefOfPerformance}
                    onChangeText={(text) =>
                      updateProduction(index, 'briefOfPerformance', text)
                    }
                    placeholder="Brief of Performance"
                    multiline
                    numberOfLines={4}
                  />

                  <TextInput
                    style={styles.input}
                    value={prod.approxBudget}
                    onChangeText={(text) => updateProduction(index, 'approxBudget', text)}
                    placeholder="Approx Budget (INR)"
                    keyboardType="numeric"
                  />

                  <TextInput
                    style={styles.input}
                    value={prod.sample}
                    onChangeText={(text) => updateProduction(index, 'sample', text)}
                    placeholder="Performance Link"
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addProduction}>
                <Ionicons name="add-circle" size={24} color="#b91c1c" />
                <Text style={styles.addButtonText}>Add Production</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Performance Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Videos</Text>
          {perfVideos.map((video, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={styles.label}>Video Link {index + 1}</Text>
              <TextInput
                style={styles.input}
                value={video}
                onChangeText={(text) => {
                  const updated = [...perfVideos];
                  updated[index] = text;
                  setPerfVideos(updated);
                }}
                placeholder="Enter video URL"
              />
            </View>
          ))}
        </View>

        {/* Highlights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Highlights</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.aboutJourney}
            onChangeText={(text) => setFormData({ ...formData, aboutJourney: text })}
            placeholder="Highlights of your performance journey"
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Update Performance Profile</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
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
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
 section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#AD2F3B',
    marginBottom: 16,
  },
  
  // IMPORTANT: Add/Update these for proper spacing
  inputGroup: {
    marginBottom: 16, // This creates space between inputs
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    color: '#333',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCode: {
    flex: 0.3,
    backgroundColor: '#f5f5f5',
  },
  phoneNumber: {
    flex: 0.7,
  },
  
  // Performance card styling with better spacing
  perfCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16, // Space between performance cards
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  perfCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  perfCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AD2F3B',
    marginBottom: 16, // Space after title
  },
  
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#AD2F3B',
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#fff',
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginLeft: 8,
    color: '#AD2F3B',
    fontWeight: '600',
    fontSize: 15,
  },
  
  saveButton: {
    backgroundColor: '#AD2F3B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },



  // Add these styles:
uploadImageButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 8,
  backgroundColor: '#AD2F3B',
  borderRadius: 8,
  padding: 12,
},
uploadImageButtonText: {
  color: '#fff',
  marginLeft: 8,
  fontWeight: 'bold',
},
imageHint: {
  fontSize: 11,
  color: '#AD2F3B',
  marginBottom: 4,
},
imageGrid: {
  flexDirection: 'row',
//   flexWrap: 'wrap',
  gap: 8,
  marginTop: 12,
},
imageCard: {
  position: 'relative',
  width: 80,
  height: 80,
  marginRight: 8,
  marginBottom: 8,
},
performanceImage: {
  width: 80,
  height: 80,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
},
removeImageButton: {
  position: 'absolute',
  top: -6,
  right: -6,
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 2,
  zIndex: 2,
},
noImagesContainer: {
  alignItems: 'center',
  marginTop: 8,
  marginBottom: 8,
},
noImagesText: {
  color: '#aaa',
  fontSize: 13,
  marginTop: 4,
},

});