import Reminder from "../models/Reminder";

const notificationService = {
  sendSms: async (to: string, text: string) => {
    console.log("[notificationService] sendSms to", to, text);
    return true;
  },
  sendWhatsApp: async (to: string, text: string) => {
    console.log("[notificationService] sendWhatsApp to", to, text);
    return true;
  },
  sendReminder: async (reminder: typeof Reminder.prototype) => {
    const to = "unknown"; // lookup customer phone in a real implementation
    const text = reminder.message;
    if (reminder.channel === "sms" || reminder.channel === "both") {
      await notificationService.sendSms(to, text);
    }
    if (reminder.channel === "whatsapp" || reminder.channel === "both") {
      await notificationService.sendWhatsApp(to, text);
    }
    return true;
  },
};

export default notificationService;
