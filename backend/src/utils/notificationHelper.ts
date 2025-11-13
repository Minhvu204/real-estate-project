import { notificationService, CreateNotificationParams } from "../services/notification.service";
import { NotificationType } from "../models/notification.model";
import { getIO } from "../socket/socket";


export async function createNotification(
  userId: string,
  title: string,
  message: string,
  options?: {
    type?: NotificationType;
    relatedId?: string;
    actionUrl?: string;
  }
) {
  try {
    const notification = await notificationService.createNotification({
      userId,
      title,
      message,
      type: options?.type || "system",
      relatedId: options?.relatedId,
      actionUrl: options?.actionUrl,
    });

    // Emit notification real-time qua Socket.IO nếu user đang online
    const io = getIO();
    if (io) {
      io.to(`user:${userId}`).emit("new_notification", notification);
      
      // Emit unread count update
      const unreadCount = await notificationService.getUnreadCount(userId);
      io.to(`user:${userId}`).emit("unread_count_update", { unreadCount });
    }

    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

export async function createNotificationsForUsers(
  userIds: string[],
  title: string,
  message: string,
  options?: {
    type?: NotificationType;
    relatedId?: string;
    actionUrl?: string;
  }
) {
  try {
    const promises = userIds.map((userId) =>
      createNotification(userId, title, message, options)
    );
    await Promise.all(promises);
  } catch (error) {
    console.error("Failed to create notifications for users:", error);
  }
}


// Notification khi có appointment mới
export async function notifyNewAppointment(
  agentId: string,
  buyerName: string,
  propertyTitle: string,
  appointmentId: string
) {
  return createNotification(
    agentId,
    "Lịch hẹn mới",
    `${buyerName} đã đặt lịch hẹn xem ${propertyTitle}`,
    {
      type: "appointment",
      relatedId: appointmentId,
      actionUrl: `/appointments/${appointmentId}`,
    }
  );
}

// Notification khi agent accept/reject appointment
export async function notifyAppointmentStatus(
  buyerId: string,
  agentName: string,
  propertyTitle: string,
  status: "accepted" | "rejected",
  appointmentId: string
) {
  const title = status === "accepted" ? "Lịch hẹn được chấp nhận" : "Lịch hẹn bị từ chối";
  const message =
    status === "accepted"
      ? `${agentName} đã chấp nhận lịch hẹn xem ${propertyTitle}`
      : `${agentName} đã từ chối lịch hẹn xem ${propertyTitle}`;

  return createNotification(buyerId, title, message, {
    type: "appointment",
    relatedId: appointmentId,
    actionUrl: `/appointments/${appointmentId}`,
  });
}

// Notification khi có offer mới
export async function notifyNewOffer(
  agentId: string,
  buyerName: string,
  propertyTitle: string,
  amount: number,
  offerId: string
) {
  return createNotification(
    agentId,
    "Offer mới",
    `${buyerName} đã đưa ra offer ${amount.toLocaleString()} VNĐ cho ${propertyTitle}`,
    {
      type: "offer",
      relatedId: offerId,
      actionUrl: `/offers/${offerId}`,
    }
  );
}

// Notification khi agent accept/reject offer
export async function notifyOfferStatus(
  buyerId: string,
  agentName: string,
  propertyTitle: string,
  status: "accepted" | "rejected",
  offerId: string
) {
  const title = status === "accepted" ? "Offer được chấp nhận" : "Offer bị từ chối";
  const message =
    status === "accepted"
      ? `${agentName} đã chấp nhận offer của bạn cho ${propertyTitle}`
      : `${agentName} đã từ chối offer của bạn cho ${propertyTitle}`;

  return createNotification(buyerId, title, message, {
    type: "offer",
    relatedId: offerId,
    actionUrl: `/offers/${offerId}`,
  });
}

// Notification khi có tin nhắn mới (nếu receiver offline)
export async function notifyNewMessage(
  receiverId: string,
  senderName: string,
  message: string,
  conversationId: string
) {
  return createNotification(receiverId, `Tin nhắn mới từ ${senderName}`, message, {
    type: "chat",
    relatedId: conversationId,
    actionUrl: `/chat/${conversationId}`,
  });
}

// Notification khi property được approve/reject
export async function notifyPropertyStatus(
  userId: string, // owner hoặc agent
  propertyTitle: string,
  status: "approved" | "rejected",
  propertyId: string,
  reason?: string
) {
  const title = status === "approved" ? "Property được phê duyệt" : "Property bị từ chối";
  const message =
    status === "approved"
      ? `Property "${propertyTitle}" của bạn đã được phê duyệt`
      : `Property "${propertyTitle}" của bạn đã bị từ chối${reason ? `: ${reason}` : ""}`;

  return createNotification(userId, title, message, {
    type: "property",
    relatedId: propertyId,
    actionUrl: `/properties/${propertyId}`,
  });
}

// Notification khi agent forward offer cho seller
export async function notifyOfferForwarded(
  sellerId: string,
  agentName: string,
  propertyTitle: string,
  amount: number,
  offerId: string
) {
  return createNotification(
    sellerId,
    "Offer cần duyệt",
    `${agentName} đã forward offer ${amount.toLocaleString()} VNĐ cho ${propertyTitle}`,
    {
      type: "offer",
      relatedId: offerId,
      actionUrl: `/offers/${offerId}`,
    }
  );
}

// Notification khi seller accept offer
export async function notifyOfferAccepted(
  buyerId: string,
  agentId: string,
  sellerName: string,
  propertyTitle: string,
  offerId: string,
  dealId?: string
) {
  // Notify buyer
  await createNotification(
    buyerId,
    "Offer được chấp nhận",
    `Seller đã chấp nhận offer của bạn cho ${propertyTitle}`,
    {
      type: "offer",
      relatedId: offerId,
      actionUrl: dealId ? `/deals/${dealId}` : `/offers/${offerId}`,
    }
  );

  // Notify agent
  await createNotification(
    agentId,
    "Offer được chấp nhận",
    `${sellerName} đã chấp nhận offer cho ${propertyTitle}`,
    {
      type: "offer",
      relatedId: offerId,
      actionUrl: dealId ? `/deals/${dealId}` : `/offers/${offerId}`,
    }
  );
}

// Notification khi seller reject offer
export async function notifyOfferRejected(
  buyerId: string,
  agentId: string,
  sellerName: string,
  propertyTitle: string,
  offerId: string,
  reason?: string
) {
  // Notify buyer
  await createNotification(
    buyerId,
    "Offer bị từ chối",
    `Seller đã từ chối offer của bạn cho ${propertyTitle}${reason ? `: ${reason}` : ""}`,
    {
      type: "offer",
      relatedId: offerId,
      actionUrl: `/offers/${offerId}`,
    }
  );

  // Notify agent
  await createNotification(
    agentId,
    "Offer bị từ chối",
    `${sellerName} đã từ chối offer cho ${propertyTitle}${reason ? `: ${reason}` : ""}`,
    {
      type: "offer",
      relatedId: offerId,
      actionUrl: `/offers/${offerId}`,
    }
  );
}

// Notification khi tạo deal mới
export async function notifyDealCreated(
  buyerId: string,
  sellerId: string,
  agentId: string,
  propertyTitle: string,
  dealId: string
) {
  const message = `Deal mới đã được tạo cho ${propertyTitle}`;
  
  await Promise.all([
    createNotification(buyerId, "Deal mới", message, {
      type: "system",
      relatedId: dealId,
      actionUrl: `/deals/${dealId}`,
    }),
    createNotification(sellerId, "Deal mới", message, {
      type: "system",
      relatedId: dealId,
      actionUrl: `/deals/${dealId}`,
    }),
    createNotification(agentId, "Deal mới", message, {
      type: "system",
      relatedId: dealId,
      actionUrl: `/deals/${dealId}`,
    }),
  ]);
}