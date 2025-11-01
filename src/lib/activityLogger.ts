import { activityAPI } from "./api";

/**
 * Helper function to get admin email from localStorage
 */
export const getAdminEmail = (): string => {
  const session = localStorage.getItem("adminSession");
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      return sessionData.user?.email || "admin@victus.com";
    } catch {
      return "admin@victus.com";
    }
  }
  return "admin@victus.com";
};

/**
 * Quick log activity for admin actions
 */
export const logActivity = async (
  actionType: string,
  entityType: string,
  entityId?: number,
  description?: string
) => {
  try {
    await activityAPI.quickLog({
      admin_email: getAdminEmail(),
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      description: description,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw error - activity logging should not break the main functionality
  }
};

