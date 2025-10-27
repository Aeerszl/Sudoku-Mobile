import { Audio } from 'expo-av';

/**
 * Ses yönetim servisi
 */
class SoundService {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.isLoaded = false;
  }

  /**
   * Sesleri yükle
   */
  async loadSounds() {
    if (this.isLoaded) return;

    try {
      // Audio mode'u ayarla - iOS ve Android için
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: 1,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false,
      });

      // Ses dosyalarını yükle
      const soundFiles = {
        click: require('../../assets/sounds/click.wav'),
        error: require('../../assets/sounds/error.wav'),
        success: require('../../assets/sounds/succes.wav'),
        win: require('../../assets/sounds/win.wav'),
      };

      // Her ses için Sound objesi oluştur
      for (const [name, source] of Object.entries(soundFiles)) {
        const { sound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: false, volume: 1.0 }
        );
        this.sounds[name] = sound;
      }

      this.isLoaded = true;
      console.log('✅ Sesler yüklendi');
    } catch (error) {
      console.error('❌ Sesler yüklenemedi:', error);
    }
  }

  /**
   * Ses çal
   */
  async play(soundName) {
    if (!this.isEnabled) {
      console.log('🔇 Sesler kapalı');
      return;
    }

    if (!this.isLoaded) {
      console.log('⏳ Sesler henüz yüklenmedi, yükleniyor...');
      await this.loadSounds();
    }

    try {
      const sound = this.sounds[soundName];
      if (sound) {
        // Eğer çalıyorsa durdur ve başa sar
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.setPositionAsync(0);
          await sound.playAsync();
          console.log(`🔊 Ses çalıyor: ${soundName}`);
        }
      } else {
        console.warn(`⚠️ Ses bulunamadı: ${soundName}`);
      }
    } catch (error) {
      console.error(`❌ Ses çalınamadı (${soundName}):`, error);
    }
  }

  /**
   * Sesleri aç/kapat
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Tüm sesleri temizle
   */
  async unloadAll() {
    for (const sound of Object.values(this.sounds)) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Sessizce görmezden gel
      }
    }
    this.sounds = {};
    this.isLoaded = false;
  }
}

// Singleton instance
export const soundService = new SoundService();
