import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Thay đổi URL này thành IP nội bộ của bạn nếu dùng thiết bị thật
// Đối với Android Emulator: http://10.0.2.2:4000
const BACKEND_URL = 'http://192.168.1.5:4000'; 

export default function App() {
  // Navigation States
  const [screen, setScreen] = useState('Welcome'); // 'Welcome' | 'Login' | 'Register' | 'Home' | 'Tours' | 'Hotels' | 'Flights' | 'TourDetail' | 'HotelDetail' | 'Chat' | 'Profile' | 'Blogs'
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    totalPeople: 1,
    seatClass: 'ECONOMY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  // Chat States
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Data States
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration States
  const [currentStep, setCurrentStep] = useState(0);
  const [regData, setRegData] = useState({ name: '', email: '', password: '', otp: '' });
  const [receivedOtp, setReceivedOtp] = useState('');

  // Login States
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Fetch Data on Load
  useEffect(() => {
    if (screen === 'Home' || screen === 'Tours' || screen === 'Hotels' || screen === 'Flights') {
      fetchData();
    }
    if (isLoggedIn && (screen === 'Profile' || screen === 'Home')) {
      fetchUserBookings();
    }
  }, [screen, isLoggedIn]);

  const fetchUserBookings = async () => {
    if (!userData?.id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/user/${userData.id}`);
      const data = await res.json();
      if (res.ok) setUserBookings(data);
    } catch (e) {
      console.log('Error fetching user bookings:', e);
    }
  };

  const fetchData = async () => {
    try {
      const [toursRes, hotelsRes, flightsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/tours`),
        fetch(`${BACKEND_URL}/api/hotels`),
        fetch(`${BACKEND_URL}/api/flights`)
      ]);
      
      const toursData = await toursRes.json();
      const hotelsData = await hotelsRes.json();
      const flightsData = await flightsRes.json();
      
      // Fetch blogs
      try {
        const blogsRes = await fetch(`${BACKEND_URL}/api/blogs`);
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      } catch (e) {}

      setTours(toursData);
      setHotels(hotelsData);
      setFlights(flightsData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'; 
    if (path.startsWith('http')) return path;
    // Nối thêm BACKEND_URL nếu là đường dẫn nội bộ (/images/...)
    return `${BACKEND_URL}${path}`;
  };

  const getGalleryImages = (mainImage, productId, category) => {
    const id = Number(productId) || 1;
    const cat = category.toLowerCase() === 'flight' ? 'flight' : (category.toLowerCase() === 'hotel' ? 'hotel' : 'tour');
    const pools = {
      hotel: { prefix: '/images/imghotel', count: 40 },
      tour: { prefix: '/images/imgtour', count: 40 },
      flight: { prefix: '/images/imgflight', count: 5 },
    };
    const { prefix, count } = pools[cat];
    const targetCount = Math.min(count, 7);
    const indices = [];
    let seed = id;
    while (indices.length < targetCount) {
      seed = (seed * 1103515245 + 12345) % 1000000;
      const idx = (Math.abs(seed) % count) + 1;
      if (!indices.includes(idx)) indices.push(idx);
    }
    const extras = indices.map(i => `${prefix}${i}.jpg`);
    const allImages = [mainImage, ...extras.filter(img => img !== mainImage)];
    return allImages.map(img => getImageUrl(img)).slice(0, 8);
  };

  const onSendOtp = async () => {
    if (!regData.email || !regData.name || !regData.password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setReceivedOtp(data.message || '');
        setCurrentStep(1);
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể gửi OTP');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async () => {
    if (!regData.otp) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: regData.name, 
          email: regData.email, 
          password: regData.password, 
          otp: regData.otp 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
        setScreen('Login');
      } else {
        Alert.alert('Lỗi', data.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginData.email, 
          password: loginData.password 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Lưu thông tin người dùng nếu cần (trong app thực tế sẽ lưu vào AsyncStorage)
        setIsLoggedIn(true);
        setUserData(data);
        setScreen('Home');
        setLoginData({ email: '', password: '' }); // Reset form
      } else {
        Alert.alert('Lỗi', data.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!isLoggedIn) {
      Alert.alert('Tham gia Chat', 'Bạn cần đăng nhập để bắt đầu trò chuyện với nhân viên hỗ trợ.', [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => setScreen('Login') }
      ]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/chat/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatRoom(data);
        setMessages(data.messages || []);
        setScreen('Chat');
      }
    } catch (err) {
      console.log('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      content: chatInput,
      senderRole: 'USER',
      createdAt: new Date().toISOString()
    };
    setMessages([...messages, newMsg]);
    setChatInput('');
    // Giả lập Admin phản hồi
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: "Chào bạn! TravelEasy đã nhận được yêu cầu. Nhân viên hỗ trợ sẽ phản hồi bạn sớm nhất nhé!",
        senderRole: 'ADMIN',
        createdAt: new Date().toISOString()
      }]);
    }, 2000);
  };

  const renderWelcome = () => (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <Image 
        source={{ uri: getImageUrl('/images/welcome-bg.jpg') }} 
        style={StyleSheet.absoluteFillObject} 
      />
      <LinearGradient 
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      <View style={styles.welcomeContent}>
        <View style={styles.logoCircle}>
          <Ionicons name="airplane" size={50} color="#1677ff" />
        </View>
        <Text style={styles.welcomeTitle}>TravelEasy</Text>
        <Text style={styles.welcomeSubtitle}>Hành trình vạn dặm, bắt đầu từ một cái chạm.</Text>
        
        <View style={styles.welcomeButtons}>
          <TouchableOpacity 
            style={styles.welcomePrimaryBtn} 
            onPress={() => setScreen('Home')}
          >
            <Text style={styles.welcomePrimaryBtnText}>Bắt đầu hành trình</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.welcomeSecondaryBtn}
            onPress={() => setScreen('Login')}
          >
            <Text style={styles.welcomeSecondaryBtnText}>Tôi đã có tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderChat = () => (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setScreen('Home')} style={styles.chatBack}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.chatTargetInfo}>
          <Text style={styles.chatTargetName}>Hỗ trợ trực tuyến</Text>
          <View style={styles.onlineStatus}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Đang hoạt động</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatMessagesList} ref={(ref) => ref?.scrollToEnd({animated: true})}>
        {messages.length === 0 ? (
          <View style={styles.emptyChat}>
             <Ionicons name="chatbubbles-outline" size={60} color="#ddd" />
             <Text style={styles.emptyChatText}>Bắt đầu trò chuyện với chúng tôi!</Text>
          </View>
        ) : (
          messages.map(msg => (
            <View key={msg.id} style={[styles.msgContainer, msg.senderRole === 'USER' ? styles.msgUser : styles.msgAdmin]}>
              <View style={[styles.msgBubble, msg.senderRole === 'USER' ? styles.msgBubbleUser : styles.msgBubbleAdmin]}>
                <Text style={[styles.msgText, msg.senderRole === 'USER' ? styles.msgTextUser : styles.msgTextAdmin]}>
                  {msg.content}
                </Text>
              </View>
              <Text style={styles.msgTime}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.chatInputRow}>
        <TouchableOpacity style={styles.chatAttachBtn}><Ionicons name="add-circle-outline" size={26} color="#1677ff" /></TouchableOpacity>
        <TextInput 
          style={styles.chatInputBox}
          placeholder="Nhập tin nhắn..."
          value={chatInput}
          onChangeText={setChatInput}
          multiline
        />
        <TouchableOpacity style={styles.chatSendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={22} color={chatInput.trim() ? "#1677ff" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderRegister = () => (
    <SafeAreaView style={styles.registerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          if (currentStep > 0) {
            setCurrentStep(0);
            setReceivedOtp('');
          } else {
            setScreen('Welcome');
          }
        }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Đăng Ký</Text>
        <Text style={styles.subtitle}>{currentStep === 0 ? 'Tạo tài khoản mới' : 'Xác thực email của bạn'}</Text>

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, { backgroundColor: '#52c41a' }]} />
          <View style={[styles.stepLine, { backgroundColor: currentStep === 1 ? '#52c41a' : '#ddd' }]} />
          <View style={[styles.stepDot, { backgroundColor: currentStep === 1 ? '#52c41a' : '#ddd' }]} />
        </View>

        {currentStep === 0 ? (
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Họ và Tên</Text>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={20} color="#1677ff" />
                <TextInput 
                  style={styles.input} 
                  placeholder="Nhập tên của bạn" 
                  value={regData.name}
                  onChangeText={(text) => setRegData({...regData, name: text})}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color="#1677ff" />
                <TextInput 
                  style={styles.input} 
                  placeholder="name@example.com" 
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regData.email}
                  onChangeText={(text) => setRegData({...regData, email: text})}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={20} color="#1677ff" />
                <TextInput 
                  style={styles.input} 
                  placeholder="••••••••" 
                  secureTextEntry
                  value={regData.password}
                  onChangeText={(text) => setRegData({...regData, password: text})}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.authSubmitBtn} 
              onPress={onSendOtp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.authSubmitBtnText}>Tiếp theo</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.otpMessage}>
              Mã xác nhận đã gửi tới <Text style={{ color: '#1677ff', fontWeight: 'bold' }}>{regData.email}</Text>
            </Text>

            {receivedOtp && (
              <View style={styles.otpBoxContainer}>
                <Text style={styles.otpBoxTitle}>Mã OTP:</Text>
                <Text style={styles.otpBoxValue}>{receivedOtp.replace('Mã OTP: ', '')}</Text>
              </View>
            )}

            <View style={styles.otpInputRow}>
              <TextInput 
                style={styles.otpBigInput} 
                placeholder="00000000" 
                maxLength={8}
                keyboardType="number-pad"
                value={regData.otp}
                onChangeText={(text) => setRegData({...regData, otp: text})}
              />
            </View>

            <TouchableOpacity 
              style={[styles.authSubmitBtn, { backgroundColor: '#1677ff' }]} 
              onPress={onRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.authSubmitBtnText}>Hoàn tất đăng ký</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  const renderLogin = () => (
    <SafeAreaView style={styles.registerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen('Welcome')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Đăng Nhập</Text>
        <Text style={styles.subtitle}>Sẵn sàng để tiếp tục hành trình của bạn</Text>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
             <Text style={styles.inputLabel}>Email</Text>
             <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color="#1677ff" />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email của bạn" 
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginData.email}
                  onChangeText={(text) => setLoginData({...loginData, email: text})}
                />
              </View>
          </View>

          <View style={styles.inputWrapper}>
             <Text style={styles.inputLabel}>Mật khẩu</Text>
             <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={20} color="#1677ff" />
                <TextInput 
                  style={styles.input} 
                  placeholder="Mật khẩu của bạn" 
                  secureTextEntry
                  value={loginData.password}
                  onChangeText={(text) => setLoginData({...loginData, password: text})}
                />
              </View>
          </View>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 25 }}>
            <Text style={{ color: '#1677ff', fontWeight: '600' }}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.authSubmitBtn} 
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.authSubmitBtnText}>Đăng Nhập</Text>}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
            <Text style={{ color: '#666' }}>Mới sử dụng TravelEasy? </Text>
            <TouchableOpacity onPress={() => setScreen('Register')}>
              <Text style={{ color: '#1677ff', fontWeight: 'bold' }}>Tạo tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Fallback for screens not implemented yet
  const renderPlaceholder = (title) => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => setScreen('Welcome')}>
        <Text style={{ color: '#52c41a', marginTop: 20 }}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfile = () => {
    const statusLabel = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PAID: 'Đã thanh toán',
      CANCELLED: 'Đã hủy',
      COMPLETED: 'Hoàn thành',
    };

    const statusColor = {
      PENDING: '#faad14',
      CONFIRMED: '#1677ff',
      PAID: '#52c41a',
      CANCELLED: '#f5222d',
      COMPLETED: '#13c2c2',
    };

    const typeLabel = {
      TOUR: 'Tour',
      HOTEL: 'Khách sạn',
      FLIGHT: 'Chuyến bay',
    };

    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Trang Cá Nhân</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={{ alignItems: 'center', marginVertical: 30 }}>
            <View style={[styles.logoCircle, { backgroundColor: '#1677ff', marginBottom: 15 }]}>
              <Ionicons name="person" size={50} color="white" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' }}>{userData?.name || 'Người dùng'}</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>{userData?.email || 'N/A'}</Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.sectionHeading, { marginBottom: 15 }]}>Đặt chỗ của tôi ({userBookings.length})</Text>
            {userBookings.length === 0 ? (
              <View style={styles.emptyBookings}>
                <Ionicons name="receipt-outline" size={48} color="#ddd" />
                <Text style={{ color: '#999', marginTop: 10 }}>Bạn chưa có đơn đặt chỗ nào.</Text>
              </View>
            ) : (
              userBookings.map(b => (
                <View key={b.id} style={styles.bookingCardShort}>
                  <View style={styles.bookingCardHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: '#1677ff10' }]}>
                      <Text style={{ color: '#1677ff', fontSize: 10, fontWeight: 'bold' }}>{typeLabel[b.type] || b.type}</Text>
                    </View>
                    <Text style={{ color: statusColor[b.status] || '#999', fontSize: 12, fontWeight: 'bold' }}>{statusLabel[b.status] || b.status}</Text>
                  </View>
                  <Text style={styles.bookingItemName} numberOfLines={1}>{b.itemName}</Text>
                  <View style={styles.bookingCardFooter}>
                    <View>
                      <Text style={{ fontSize: 10, color: '#999' }}>Ngày đặt: {new Date(b.createdAt).toLocaleDateString()}</Text>
                      <Text style={{ fontSize: 10, color: '#999' }}>Bắt đầu: {new Date(b.startDate).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.bookingPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.finalPrice || b.price)}</Text>
                  </View>
                </View>
              ))
            )}

            <Text style={[styles.sectionHeading, { marginTop: 30, marginBottom: 15 }]}>Cài đặt tài khoản</Text>
            {[
              { icon: 'notifications-outline', label: 'Thông báo', detail: 'Đã bật' },
              { icon: 'shield-checkmark-outline', label: 'Bảo mật', detail: 'Bình thường' },
              { icon: 'help-circle-outline', label: 'Trung tâm trợ giúp', detail: '' },
            ].map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.settingsItem}>
                <View style={[styles.categoryIconCircle, { width: 40, height: 40, marginBottom: 0 }]}>
                  <Ionicons name={item.icon} size={20} color="#1677ff" />
                </View>
                <View style={{ flex: 1, marginLeft: 15, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: '600' }}>{item.label}</Text>
                  {item.detail ? <Text style={{ fontSize: 12, color: '#666' }}>{item.detail}</Text> : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[styles.authSubmitBtn, { backgroundColor: '#ff4d4f', marginTop: 40, height: 50, borderRadius: 12 }]} 
              onPress={() => {
                setIsLoggedIn(false);
                setUserData(null);
                setScreen('Welcome');
              }}
            >
              <Text style={[styles.authSubmitBtnText, { fontSize: 16 }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
        {renderBottomTabs()}
      </SafeAreaView>
    );
  };

  const renderBooking = (item, type) => {
    const isHotel = type === 'Hotel';
    const isFlight = type === 'Flight';
    const isTour = type === 'Tour';

    const calculatePrice = () => {
      let base = item.price || 0;
      let multiplier = 1;
      if (isHotel) {
        multiplier = bookingForm.seatClass === 'DOUBLE' ? 1.5 : 1;
        const start = new Date(bookingForm.startDate);
        const end = new Date(bookingForm.endDate);
        const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        return base * bookingForm.totalPeople * multiplier * diff;
      }
      if (isFlight) {
        multiplier = bookingForm.seatClass === 'BUSINESS' ? 1.5 : 1;
        return base * bookingForm.totalPeople * multiplier;
      }
      return base * bookingForm.totalPeople;
    };

    const total = calculatePrice();

    const onConfirmBooking = async () => {
      if (!bookingForm.customerName || !bookingForm.customerPhone) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin liên hệ');
        return;
      }

      setLoading(true);
      try {
        const body = {
          userId: userData.id,
          type: type.toUpperCase(),
          itemId: item.id,
          itemName: item.name,
          startDate: bookingForm.startDate,
          endDate: isHotel || isTour ? bookingForm.endDate : null,
          price: total,
          customerName: bookingForm.customerName,
          customerPhone: bookingForm.customerPhone,
          totalPeople: bookingForm.totalPeople,
          seatClass: isHotel || isFlight ? bookingForm.seatClass : null,
        };

        const res = await fetch(`${BACKEND_URL}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          Alert.alert('Thành công', 'Đặt chỗ của bạn đã được gửi và đang chờ xác nhận.', [
            { text: 'Xem lịch sử', onPress: () => {
              fetchUserBookings();
              setScreen('Profile');
            }},
            { text: 'Trang chủ', onPress: () => setScreen('Home') }
          ]);
        } else {
          const err = await res.json();
          Alert.alert('Lỗi', err.error || 'Đặt chỗ thất bại');
        }
      } catch (e) {
        Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };

    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setScreen(type + 'Detail')} style={{ marginBottom: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Xác nhận đặt hàng</Text>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 20 }]}>
          <View style={{ padding: 15, borderRadius: 15, backgroundColor: 'white', marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1677ff' }}>{item.name}</Text>
            <Text style={{ color: '#666', fontSize: 13, marginTop: 5 }}>Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
          </View>

          <View style={styles.bookingForm}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Họ và tên người đặt</Text>
              <TextInput 
                style={styles.bookingInput} 
                placeholder="Nhập họ tên" 
                value={bookingForm.customerName}
                onChangeText={t => setBookingForm({...bookingForm, customerName: t})}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput 
                style={styles.bookingInput} 
                placeholder="Nhập số điện thoại" 
                keyboardType="phone-pad"
                value={bookingForm.customerPhone}
                onChangeText={t => setBookingForm({...bookingForm, customerPhone: t})}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.inputLabel}>{isHotel ? 'Số phòng' : 'Số khách'}</Text>
                <TextInput 
                  style={styles.bookingInput} 
                  keyboardType="numeric"
                  value={String(bookingForm.totalPeople)}
                  onChangeText={t => setBookingForm({...bookingForm, totalPeople: parseInt(t) || 1})}
                />
              </View>
              {(isHotel || isFlight) && (
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>{isHotel ? 'Loại phòng' : 'Hạng vé'}</Text>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TouchableOpacity 
                      style={[styles.smallToggle, bookingForm.seatClass === (isHotel ? 'SINGLE' : 'ECONOMY') && styles.smallToggleActive]}
                      onPress={() => setBookingForm({...bookingForm, seatClass: isHotel ? 'SINGLE' : 'ECONOMY'})}
                    >
                      <Text style={[styles.smallToggleText, bookingForm.seatClass === (isHotel ? 'SINGLE' : 'ECONOMY') && styles.smallToggleTextActive]}>{isHotel ? 'Đơn' : 'Phổ thông'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.smallToggle, bookingForm.seatClass === (isHotel ? 'DOUBLE' : 'BUSINESS') && styles.smallToggleActive]}
                      onPress={() => setBookingForm({...bookingForm, seatClass: isHotel ? 'DOUBLE' : 'BUSINESS'})}
                    >
                      <Text style={[styles.smallToggleText, bookingForm.seatClass === (isHotel ? 'DOUBLE' : 'BUSINESS') && styles.smallToggleTextActive]}>{isHotel ? 'Đôi' : 'Thương gia'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{isFlight ? 'Ngày bay' : 'Ngày bắt đầu'}</Text>
              <TextInput 
                style={styles.bookingInput} 
                placeholder="YYYY-MM-DD"
                value={bookingForm.startDate}
                onChangeText={t => setBookingForm({...bookingForm, startDate: t})}
              />
            </View>

            {(isHotel || isTour) && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Ngày kết thúc</Text>
                <TextInput 
                  style={styles.bookingInput} 
                  placeholder="YYYY-MM-DD"
                  value={bookingForm.endDate}
                  onChangeText={t => setBookingForm({...bookingForm, endDate: t})}
                />
              </View>
            )}

            <View style={styles.priceSummary}>
              <Text style={{ fontSize: 16, color: '#333' }}>Tổng cộng:</Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.authSubmitBtn, { marginTop: 20 }]} 
              onPress={onConfirmBooking}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.authSubmitBtnText}>Xác nhận đặt hàng</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const renderBlogs = () => (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setScreen('Home')} style={{ marginBottom: 10, width: 40 }}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Cẩm Nang Du Lịch</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ paddingHorizontal: 24, paddingTop: 10 }}>
           {blogs.map(blog => (
            <TouchableOpacity key={blog.id} style={styles.blogCard}>
              <Image source={{ uri: blog.images && blog.images[0] ? getImageUrl(blog.images[0]) : getImageUrl(blog.image) }} style={styles.blogImage} />
              <View style={styles.blogInfo}>
                <Text style={styles.blogTitle} numberOfLines={2}>{blog.title}</Text>
                <Text style={styles.blogAuthor}>Bởi {blog.author} • {new Date(blog.createdAt || Date.now()).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderHome = () => (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <LinearGradient colors={['#1677ff', '#0958d9']} style={styles.homeHeader}>
        <View style={styles.homeHeaderContent}>
          <View>
            <Text style={styles.homeWelcome}>Chào mừng {userData ? userData.name : 'bạn'},</Text>
            <Text style={styles.homeTitle}>TravelEasy ✈️</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => {
            if (isLoggedIn) {
              setScreen('Profile'); 
            } else {
              setScreen('Login');
            }
          }}>
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput 
            placeholder="Bạn muốn đi đâu?" 
            style={styles.searchInput} 
            placeholderTextColor="#999" 
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionHeading}>Dịch vụ</Text>
          <View style={styles.categoryIcons}>
            {[
              { id: 'Tours', icon: 'map-outline', label: 'Tours', color: '#52c41a' },
              { id: 'Hotels', icon: 'business-outline', label: 'Khách sạn', color: '#fa8c16' },
              { id: 'Flights', icon: 'airplane-outline', label: 'Máy bay', color: '#1677ff' },
              { id: 'Chat', icon: 'chatbubbles-outline', label: 'Hỗ trợ', color: '#722ed1' },
            ].map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => cat.id === 'Chat' ? startChat() : setScreen(cat.id)}>
                <View style={[styles.categoryIconCircle, { backgroundColor: cat.color + '15' }]}>
                  <Ionicons name={cat.icon} size={28} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Tours */}
        <View style={styles.toursSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Tour Phổ Biến</Text>
            <TouchableOpacity onPress={() => setScreen('Tours')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {(tours.length > 0 ? (
              searchQuery ? tours.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.location?.toLowerCase().includes(searchQuery.toLowerCase())) : tours
            ) : [
              { id: 1, name: 'Tour Đà Nẵng', price: 4500000, rating: 4.8, image: '/images/default.jpg' },
              { id: 2, name: 'Tour Singapore', price: 12900000, rating: 4.9, image: '/images/default.jpg' }
            ]).map(tour => (
              <TouchableOpacity key={tour.id} style={styles.horizontalCard} onPress={() => { setSelectedItem(tour); setScreen('TourDetail'); }}>
                <Image source={{ uri: getImageUrl(tour.image) }} style={styles.horizontalCardImage} />
                <View style={styles.horizontalCardInfo}>
                  <Text style={styles.horizontalCardName} numberOfLines={1}>{tour.name}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#fadb14" />
                    <Text style={styles.ratingValue}>{(tour.rating || 5).toFixed(1)}</Text>
                  </View>
                  <Text style={styles.horizontalCardPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price || 0)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Hotels */}
        <View style={styles.toursSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Khách sạn hàng đầu</Text>
            <TouchableOpacity onPress={() => setScreen('Hotels')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {(searchQuery ? hotels.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())) : hotels.slice(0, 3)).map(hotel => (
            <TouchableOpacity key={hotel.id} style={styles.verticalCard} onPress={() => { setSelectedItem(hotel); setScreen('HotelDetail'); }}>
              <Image source={{ uri: getImageUrl(hotel.image) }} style={styles.verticalCardImage} />
              <View style={styles.verticalCardInfo}>
                <View style={styles.verticalCardHeader}>
                  <Text style={styles.verticalCardName} numberOfLines={1}>{hotel.name}</Text>
                  <View style={styles.ratingBoxSmall}>
                    <Ionicons name="star" size={10} color="#fadb14" />
                    <Text style={styles.ratingTextSmall}>{(hotel.rating || 5).toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.verticalCardLoc}><Ionicons name="location-outline" size={12} /> {hotel.location}</Text>
                <View style={styles.verticalCardFooter}>
                  <Text style={styles.verticalCardPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price || 0)}/đêm</Text>
                  <View style={styles.bookIcon}><Ionicons name="chevron-forward" size={16} color="white" /></View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blogs Section */}
        <View style={styles.toursSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Cẩm nang du lịch</Text>
            <TouchableOpacity onPress={() => setScreen('Blogs')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {(blogs.length > 0 ? blogs.slice(0, 5) : [
            { id: 1, title: 'Kinh nghiệm du lịch Đà Lạt mùa sương', author: 'TravelEasy', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500' },
            { id: 2, title: 'Top 10 bãi biển đẹp nhất Việt Nam 2024', author: 'Team Travel', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' }
          ]).map(blog => (
            <TouchableOpacity key={blog.id} style={styles.blogCard}>
              <Image source={{ uri: blog.images && blog.images[0] ? getImageUrl(blog.images[0]) : getImageUrl(blog.image) }} style={styles.blogImage} />
              <View style={styles.blogInfo}>
                <Text style={styles.blogTitle} numberOfLines={2}>{blog.title}</Text>
                <Text style={styles.blogAuthor}>Bởi {blog.author} • {new Date(blog.createdAt || Date.now()).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Tab Navigation UI */}
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderTours = () => (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Tours Du Lịch</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tours.map(tour => (
          <TouchableOpacity key={tour.id} style={styles.tourCardFull} onPress={() => { setSelectedItem(tour); setScreen('TourDetail'); }}>
            <Image source={{ uri: getImageUrl(tour.image) }} style={styles.tourImageFull} />
            <View style={styles.tourInfoOverlay}>
              <Text style={styles.tourNameFull}>{tour.name}</Text>
              <Text style={styles.tourPriceFull}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderHotels = () => (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Khách Sạn</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {(searchQuery ? hotels.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())) : hotels).map(hotel => (
          <TouchableOpacity key={hotel.id} style={styles.verticalCard} onPress={() => { setSelectedItem(hotel); setScreen('HotelDetail'); }}>
            <Image source={{ uri: getImageUrl(hotel.image) }} style={styles.verticalCardImage} />
            <View style={styles.verticalCardInfo}>
              <Text style={styles.verticalCardName}>{hotel.name}</Text>
              <Text style={styles.verticalCardLoc}>{hotel.location}</Text>
              <Text style={styles.verticalCardPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price)}/đêm</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderDetail = (item, type) => {
    // Parse Itinerary if it's a JSON string
    let parsedItinerary = [];
    if (type === 'Tour' && item.itinerary) {
      try {
        parsedItinerary = JSON.parse(item.itinerary);
      } catch (e) {
        console.log('Error parsing itinerary:', e);
      }
    }

    // Generate Multiple Images for Gallery
    const galleryImages = type === 'Flight' ? [getImageUrl(item.image)] : getGalleryImages(item.image, item.id, type);

    const isMultiImage = galleryImages.length > 1;

    return (
      <View style={styles.mainContainer}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{ backgroundColor: 'white' }}>
          {/* Image Gallery */}
          <View>
            <ScrollView 
              horizontal={isMultiImage}
              pagingEnabled={isMultiImage}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                if (isMultiImage) {
                  const offset = e.nativeEvent.contentOffset.x;
                  const index = Math.round(offset / width);
                  setActiveImage(index);
                }
              }}
              style={{ height: 350 }}
            >
              {galleryImages.map((img, idx) => (
                <Image key={idx} source={{ uri: img }} style={[styles.detailHeroImage, { width }]} resizeMode="cover" />
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.detailBackButton} 
              onPress={() => {
                setScreen('Home');
                setActiveImage(0); // Reset index
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Pagination Dots Indicator */}
            {isMultiImage && (
              <View style={styles.galleryIndicator}>
                <Text style={styles.galleryText}>{activeImage + 1} / {galleryImages.length}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailName}>{item.name}</Text>
                <View style={styles.detailLocBox}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.detailLocText}>{item.location}</Text>
                </View>
              </View>
              <View style={styles.detailRatingBox}>
                <Ionicons name="star" size={14} color="#fadb14" />
                <Text style={styles.detailRatingText}>{(item.rating || 5).toFixed(1)}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <Text style={styles.detailSectionTitle}>Giới thiệu</Text>
            <Text style={styles.detailDesc}>
              {item.description || 'Chưa có mô tả chi tiết cho dịch vụ này. Vui lòng liên hệ hỗ trợ để biết thêm thông tin.'}
            </Text>

            {type === 'Tour' && parsedItinerary.length > 0 && (
              <>
                <Text style={styles.detailSectionTitle}>Lịch trình chi tiết</Text>
                {parsedItinerary.map((day, dIdx) => (
                  <View key={dIdx} style={styles.itineraryDay}>
                    <View style={styles.itineraryDayCircle}>
                      <Text style={styles.itineraryDayText}>{day.day}</Text>
                    </View>
                    <View style={styles.itineraryContent}>
                      <Text style={styles.itineraryTitle}>{day.title}</Text>
                      {day.activities && day.activities.map((act, aIdx) => (
                        <View key={aIdx} style={styles.activityItem}>
                          <Text style={styles.activityTime}>{act.time}</Text>
                          <Text style={styles.activityDesc}>{act.description}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Detail Footer Sticky */}
        <View style={styles.detailFooter}>
          <View>
            <Text style={styles.footerPriceLabel}>{type === 'Hotel' ? 'Giá 1 đêm' : 'Giá trọn gói'}</Text>
            <Text style={styles.footerPriceValue}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.footerBookBtn}
            onPress={() => {
              if (!isLoggedIn) {
                Alert.alert(
                  'Yêu cầu đăng nhập',
                  'Bạn cần đăng nhập để thực hiện đặt hành trình này.',
                  [
                    { text: 'Bỏ qua', style: 'cancel' },
                    { text: 'Đăng nhập ngay', onPress: () => setScreen('Login') }
                  ]
                );
              } else {
                setBookingForm({
                  customerName: userData.name || '',
                  customerPhone: '',
                  totalPeople: 1,
                  seatClass: type === 'Hotel' ? 'SINGLE' : 'ECONOMY',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                });
                setScreen('Booking');
              }
            }}
          >
            <Text style={styles.footerBookBtnText}>Đặt ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFlights = () => (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Vé Máy Bay</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {flights.map(flight => (
          <TouchableOpacity key={flight.id} style={styles.verticalCard} onPress={() => { setSelectedItem(flight); setScreen('FlightDetail'); }}>
            <View style={[styles.verticalCardInfo, { paddingLeft: 15 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.verticalCardName}>{flight.name}</Text>
                <Text style={{ color: '#1677ff', fontWeight: 'bold' }}>{flight.code}</Text>
              </View>
              <Text style={styles.verticalCardLoc}>Địa danh: {flight.location || 'Nội địa'}</Text>
              <Text style={styles.verticalCardPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(flight.price || 0)}</Text>
              <Text style={styles.msgTime}>Cập nhật: {new Date(flight.createdAt || Date.now()).toLocaleDateString('vi-VN')}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderBottomTabs = () => (
    <View style={styles.bottomTabs}>
      {[
        { id: 'Home', icon: 'home-outline', label: 'Khám phá' },
        { id: 'Tours', icon: 'map-outline', label: 'Tours' },
        { id: 'Hotels', icon: 'business-outline', label: 'Ở đâu' },
        { id: 'Flights', icon: 'airplane-outline', label: 'Bay' },
      ].map(tab => (
        <TouchableOpacity 
          key={tab.id} 
          style={styles.tabItem} 
          onPress={() => setScreen(tab.id)}
        >
          <Ionicons 
            name={tab.icon} 
            size={24} 
            color={screen === tab.id ? '#1677ff' : '#999'} 
          />
          <Text style={[styles.tabLabel, { color: screen === tab.id ? '#1677ff' : '#999' }]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  switch (screen) {
    case 'Welcome': return renderWelcome();
    case 'Register': return renderRegister();
    case 'Login': return renderLogin();
    case 'Home': return renderHome();
    case 'Tours': return renderTours();
    case 'Hotels': return renderHotels();
    case 'Flights': return renderFlights();
    case 'TourDetail': return renderDetail(selectedItem, 'Tour');
    case 'HotelDetail': return renderDetail(selectedItem, 'Hotel');
    case 'FlightDetail': return renderDetail(selectedItem, 'Flight');
    case 'Booking': 
      const itemType = selectedItem?.itinerary ? 'Tour' : (selectedItem?.code ? 'Flight' : 'Hotel');
      return renderBooking(selectedItem, itemType);
    case 'Chat': return renderChat();
    case 'Profile': return renderProfile();
    case 'Blogs': return renderBlogs();
    default: return renderWelcome();
  }
}

const styles = StyleSheet.create({
  // New Premium Styles
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  homeHeader: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  homeHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  homeWelcome: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  categoriesSection: {
    marginTop: 25,
    paddingHorizontal: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  categoryIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: '22%',
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  toursSection: {
    marginTop: 30,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  seeAll: {
    color: '#1677ff',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 24,
  },
  horizontalCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  horizontalCardImage: {
    width: '100%',
    height: 120,
  },
  horizontalCardInfo: {
    padding: 12,
  },
  horizontalCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingValue: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
  horizontalCardPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1677ff',
  },
  verticalCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  verticalCardImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  verticalCardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  verticalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  ratingBoxSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  verticalCardLoc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  verticalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalCardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1677ff',
  },
  bookIcon: {
    backgroundColor: '#1677ff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 12, // Nhấc lên một chút cho đẹp
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  screenHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tourCardFull: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: 24,
    height: 200,
  },
  tourImageFull: {
    width: '100%',
    height: '100%',
  },
  tourInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tourNameFull: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tourPriceFull: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  // Auth & UI Layout Styles
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 30,
    paddingBottom: 60,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  welcomeButtons: {
    width: '100%',
  },
  welcomePrimaryBtn: {
    backgroundColor: '#1677ff',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#1677ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomePrimaryBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeSecondaryBtn: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  welcomeSecondaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1a1a1a',
  },
  authSubmitBtn: {
    backgroundColor: '#1677ff',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#1677ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  authSubmitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  otpMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  otpBoxContainer: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  otpBoxTitle: {
    fontSize: 13,
    color: '#0050b3',
    marginBottom: 4,
  },
  otpBoxValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1677ff',
    letterSpacing: 2,
  },
  otpInputRow: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpBigInput: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 10,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1677ff',
    width: '80%',
    paddingBottom: 10,
  },
  // Detail Screen Styles
  detailHeroImage: {
    width: '100%',
    height: 350,
  },
  detailBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    marginTop: -30,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  detailLocBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLocText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailRatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    minWidth: 45,
    justifyContent: 'center',
  },
  detailRatingText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginVertical: 25,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#666',
  },
  footerPriceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1677ff',
  },
  footerBookBtn: {
    backgroundColor: '#1677ff',
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: "#1677ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  footerBookBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryIndicator: {
    position: 'absolute',
    bottom: 45,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  galleryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itineraryDay: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  itineraryDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1677ff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  itineraryDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itineraryContent: {
    flex: 1,
    marginLeft: 15,
    paddingTop: 5,
  },
  itineraryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  activityItem: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#e6f7ff',
  },
  activityTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1677ff',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  // Floating Chat Button
  chatFab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 999,
  },
  chatFabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Chat Screen Styles
  chatHeader: {
    height: 100,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  chatBack: {
    padding: 5,
  },
  chatTargetInfo: {
    marginLeft: 15,
  },
  chatTargetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52c41a',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#666',
  },
  chatMessagesList: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyChat: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyChatText: {
    marginTop: 15,
    color: '#999',
    fontSize: 16,
  },
  msgContainer: {
    marginBottom: 20,
    maxWidth: '80%',
  },
  msgUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  msgAdmin: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  msgBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  msgBubbleUser: {
    backgroundColor: '#1677ff',
    borderBottomRightRadius: 5,
    borderTopRightRadius: 20,
  },
  msgBubbleAdmin: {
    backgroundColor: '#f1f3f5',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 20,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
  },
  msgTextUser: {
    color: 'white',
  },
  msgTextAdmin: {
    color: '#1a1a1a',
  },
  msgTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 6,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    marginBottom: 10,
  },
  chatAttachBtn: {
    padding: 5,
  },
  chatInputBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  chatSendBtn: {
    padding: 5,
  },
  // Blog Styles
  blogCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  blogImage: {
    width: 100,
    height: 100,
  },
  blogInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  blogTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  blogAuthor: {
    fontSize: 12,
    color: '#999',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyBookings: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  bookingCardShort: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bookingItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bookingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 8,
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1677ff',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  bookingForm: {
    marginTop: 10,
  },
  bookingInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  smallToggle: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  smallToggleActive: {
    backgroundColor: '#1677ff',
  },
  smallToggleText: {
    fontSize: 12,
    color: '#666',
  },
  smallToggleTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
