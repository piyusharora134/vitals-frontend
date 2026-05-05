import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export async function predictRisk(payload) {

  // ✅ 1. Store user input in Firebase
  try {
    await addDoc(collection(db, "user_inputs"), {
      age: payload.age,
      gender: payload.gender,
      bmi: payload.bmi,
      blood_pressure: payload.blood_pressure,
      cholesterol: payload.cholesterol,
      glucose: payload.glucose,
      smoking_status: payload.smoking_status,
      physical_activity: payload.physical_activity,
      alcohol_intake: payload.alcohol_intake,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Firebase error:", error);
  }

  // ✅ 2. Call backend for prediction
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('API error');

  return res.json();
}