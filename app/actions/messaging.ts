"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Get or create a conversation between two users
export async function getOrCreateConversation(otherUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [a, b] = [user.id, otherUserId].sort();
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user1_id", a)
    .eq("user2_id", b)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({ user1_id: a, user2_id: b })
    .select("id")
    .single();

  if (error) throw new Error("Could not create conversation");
  return newConv.id;
}

// Send a message
export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = formData.get("content")?.toString().trim();
  const conversationId = formData.get("conversationId")?.toString();
  const receiverId = formData.get("receiverId")?.toString();

  if (!content || !conversationId || !receiverId) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: receiverId,
      content,
    });

  if (error) throw new Error("Failed to send message");

  await supabase
    .from("conversations")
    .update({
      last_message: content,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  revalidatePath("/messages");
  revalidatePath(`/messages/${receiverId}`);
}