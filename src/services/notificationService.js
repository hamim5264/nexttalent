import supabase from "../supabaseClient";

// Send notification to a specific user
export async function notifySpecificUser(recipient_uid, role, title, message) {
  const { error } = await supabase.from("notifications").insert({
    recipient_uid,
    role,    
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error sending notification to specific user:", error);
  } else {
    console.log("Notification sent to specific user:", recipient_uid);
  }
}

export async function notifyAdmin(title, message) {
  const adminUid = import.meta.env.VITE_ADMIN_UID;
  if (!adminUid) {
    console.error("Admin UID not configured in environment variables.");
    return;
  }

  await notifySpecificUser(adminUid, "admin", title, message); 
}

// Send notification to all users of a specific role
export async function notifyRole(role, title, message) {
  let users = [];

  if (role === "user") {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("firebase_uid");
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    users = data;
  } else if (role === "employer") {
    const { data, error } = await supabase
      .from("employer_profiles")
      .select("firebase_uid");
    if (error) {
      console.error("Error fetching employers:", error);
      return;
    }
    users = data;
  } else if (role === "admin") {
    users = [{ firebase_uid: "<admin-firebase-uid>" }];
  }

  if (!users.length) {
    console.warn(`No users found for role ${role}`);
    return;
  }

  const notifications = users.map((user) => ({
    recipient_uid: user.firebase_uid,
    role,  
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from("notifications")
    .insert(notifications);

  if (insertError) {
    console.error(`Error sending notifications to ${role}:`, insertError);
  }
}

// Send notification to ALL users
export async function notifyAllUsers(title, message) {
  const { data: users, error } = await supabase
    .from("user_profiles")
    .select("firebase_uid, role");

  if (error) {
    console.error("Error fetching all users:", error);
    return;
  }

  if (!users.length) {
    console.log("No users found to notify.");
    return;
  }

  const notifications = users.map((user) => ({
    recipient_uid: user.firebase_uid,
    role: user.role,  // ✅ keep the role for each
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from("notifications")
    .insert(notifications);

  if (insertError) {
    console.error("Error sending notifications to all users:", insertError);
  } else {
    console.log("Notifications sent to all users.");
  }
}

