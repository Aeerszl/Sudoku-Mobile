# 🚀 Google Play Store Yayınlama Rehberi

## 📋 Ön Hazırlık

### 1. EAS CLI Kur
```bash
npm install -g eas-cli
```

### 2. Expo Hesabına Giriş Yap
```bash
eas login
```

### 3. Proje Yapılandırması
```bash
eas build:configure
```

## 🔧 APK/AAB Oluşturma

### İlk Defa Yayınlama (AAB):
```bash
eas build --platform android --profile production
```

### Test İçin APK:
```bash
eas build --platform android --profile preview
```

## 📱 Google Play Console Adımları

### 1. Google Play Console'a Git
- https://play.google.com/console adresine git
- Google hesabınla giriş yap (ilk kez ise $25 tek seferlik ücret)

### 2. Yeni Uygulama Oluştur
- "Create app" butonuna tıkla
- App adı: **Sudoku - Klasik Bulmaca**
- Dil: Türkçe
- Kategori: Games > Puzzle
- Fiyat: Free

### 3. Uygulama İçeriği Doldur

#### Store Listing (Mağaza Bilgileri):
- **Kısa Açıklama** (80 karakter):
```
Klasik Sudoku! Dört zorluk seviyesi, ipucu sistemi ve istatistikler.
```

- **Tam Açıklama** (4000 karakter):
```
🎮 Sudoku - Klasik Bulmaca Oyunu

En popüler sayı bulmacası Sudoku artık cebinizde! Beyin jimnastiği yapmak, mantık yeteneğinizi geliştirmek ve eğlenmek için ideal.

✨ Özellikler:
• 4 Zorluk Seviyesi: Kolay, Orta, Zor, Uzman
• Akıllı İpucu Sistemi: Her seviyede farklı ipucu hakkı
• Not Modu: Olası sayıları not alın
• Hata Limiti: 3 yanlış hakkı
• İstatistikler: Performansınızı takip edin
• Ses & Titreşim: Interaktif geri bildirim
• Otomatik Kayıt: Oyununuzu kaybetmeyin

🎯 Nasıl Oynanır:
1. Bir hücreye tıklayın
2. 1-9 arası sayı seçin
3. Her satır, sütun ve 3x3 kutuda 1-9 sayıları bir kez olmalı

🏆 İstatistikler:
• Toplam oyun sayınız
• Başarı oranınız
• En iyi süreniz
• Zorluk bazlı detaylar

🎨 Özellikler:
• Modern ve temiz arayüz
• Koyu/açık tema desteği
• Offline oynanabilir
• Reklamsız deneyim
• Türkçe dil desteği

📊 Geliştiriniz:
Günlük Sudoku oynayarak:
• Hafızanızı güçlendirin
• Konsantrasyonunuzu artırın
• Mantık yeteneğinizi geliştirin
• Stres atın

İster yeni başlayan olun, ister Sudoku uzmanı, size uygun zorluk seviyesi burada!

Şimdi indirin ve Sudoku zevkine başlayın! 🎉
```

#### Ekran Görüntüleri:
- Minimum 2, maksimum 8 ekran görüntüsü
- Boyut: 1080x1920 (telefon) veya 1200x1920
- Gerekli görüntüler:
  1. Ana menü
  2. Oyun ekranı
  3. İstatistikler
  4. Ayarlar
  5. Zorluk seçimi

#### Grafik Varlıklar:
- **Feature Graphic** (1024x500 px): Ana banner
- **App Icon** (512x512 px): Uygulama ikonu

### 4. İçerik Derecelendirmesi
- Questionnaire doldur
- Yaş sınırı: 3+ (Everyone)
- Şiddet, kumar, alkol yok → PEGI 3

### 5. Fiyatlandırma & Dağıtım
- Ücretsiz
- Ülkeler: Tüm ülkeler
- İçerik derecelendirmesi: PEGI 3

### 6. AAB Yükle
- "Release" → "Production" → "Create new release"
- AAB dosyasını yükle
- Release notes ekle:
```
İlk sürüm! 🎉

Özellikler:
• 4 zorluk seviyesi
• İpucu sistemi
• Not modu
• İstatistikler
• Ses & titreşim
```

### 7. İncelemeye Gönder
- "Review release" → "Start rollout to Production"
- Google incelemesi: 1-7 gün

## 🔄 Güncelleme Yayınlama

### 1. Versiyon Güncelle
`app.json`:
```json
"version": "1.0.1",
"versionCode": 2
```

### 2. Yeni AAB Oluştur
```bash
eas build --platform android --profile production
```

### 3. Google Play Console'da Güncelle
- "Release" → "Production" → "Create new release"
- Yeni AAB yükle
- Release notes yaz
- "Review release" → "Start rollout"

## 📊 Yayın Sonrası

### Yapılacaklar:
- [ ] Store listing'i optimize et (ASO)
- [ ] Kullanıcı yorumlarını takip et
- [ ] Crash raporlarını kontrol et
- [ ] Performans metriklerini izle
- [ ] Düzenli güncellemeler yap

### Önemli Linkler:
- Google Play Console: https://play.google.com/console
- Expo Dashboard: https://expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/

## 🎯 Checklist

Yayınlamadan Önce:
- [ ] app.json güncel
- [ ] Icon ve splash screen hazır
- [ ] Tüm özellikler test edildi
- [ ] Sesler çalışıyor
- [ ] Titreşim çalışıyor
- [ ] İstatistikler kaydediliyor
- [ ] Oyun kaydediliyor
- [ ] Crash yok
- [ ] Store listing hazır
- [ ] Ekran görüntüleri hazır
- [ ] Feature graphic hazır

## 💡 İpuçları

1. **İlk yayın 1-7 gün** sürebilir
2. **Güncellemeler daha hızlı** onaylanır
3. **Beta test** yapmak için Internal Test kullan
4. **Privacy Policy** gerekebilir (ücretsiz: https://app-privacy-policy-generator.nisrulz.com/)
5. **Store Listing** optimize et (ASO - App Store Optimization)
6. **Kullanıcı yorumlarına** cevap ver

## ❓ Sorun Giderme

### Build Hatası:
```bash
eas build:configure
eas build --platform android --clear-cache
```

### Login Sorunu:
```bash
eas logout
eas login
```

### APK Test:
```bash
eas build --platform android --profile preview
```
APK'yı indir ve telefonuna yükle

---

**Not:** Google Play hesabı için $25 tek seferlik ücret gerekir.
