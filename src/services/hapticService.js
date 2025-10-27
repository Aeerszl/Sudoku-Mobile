import * as Haptics from 'expo-haptics';

/**
 * Titreşim yönetim servisi
 */
class HapticService {
  constructor() {
    this.isEnabled = true;
  }

  /**
   * Hafif titreşim (buton tıklama, not ekleme)
   */
  async light() {
    if (!this.isEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Orta titreşim (doğru sayı, ipucu)
   */
  async medium() {
    if (!this.isEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Güçlü titreşim (yanlış sayı, hata)
   */
  async heavy() {
    if (!this.isEnabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Başarı titreşimi (oyun kazanma)
   */
  async success() {
    if (!this.isEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Hata titreşimi (game over)
   */
  async error() {
    if (!this.isEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Uyarı titreşimi
   */
  async warning() {
    if (!this.isEnabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Seçim değişikliği (hücre seçimi)
   */
  async selection() {
    if (!this.isEnabled) return;
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Sessizce görmezden gel
    }
  }

  /**
   * Titreşimi aç/kapat
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }
}

// Singleton instance
export const hapticService = new HapticService();
