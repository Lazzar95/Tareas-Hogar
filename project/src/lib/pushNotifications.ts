import { supabase } from '../lib/supabase';

// VAPID Public Key - Debes generar tu propia clave
// Genera las claves con: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

export async function subscribeToPush(familyId: string, memberName: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return false;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn('VAPID_PUBLIC_KEY not configured');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Verificar si ya hay una suscripción
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Crear nueva suscripción
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const subscriptionJson = subscription.toJSON();
    
    // Guardar en Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        family_id: familyId,
        member_name: memberName,
        endpoint: subscriptionJson.endpoint,
        p256dh: subscriptionJson.keys?.p256dh,
        auth: subscriptionJson.keys?.auth,
        last_used_at: new Date().toISOString(),
      }, {
        onConflict: 'endpoint',
      });

    if (error) {
      console.error('Error saving push subscription:', error);
      return false;
    }

    console.log('Push subscription saved successfully');
    return true;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Eliminar de Supabase
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);
      
      // Cancelar suscripción
      await subscription.unsubscribe();
    }
    
    return true;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
}

export async function sendPushToFamily(
  familyId: string,
  senderName: string,
  title: string,
  body: string,
  tag?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-push', {
      body: {
        family_id: familyId,
        sender_name: senderName,
        title,
        body,
        tag,
      },
    });

    if (error) {
      console.error('Error sending push:', error);
      return false;
    }

    console.log('Push sent:', data);
    return true;
  } catch (error) {
    console.error('Error invoking send-push function:', error);
    return false;
  }
}
