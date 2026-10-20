"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { BuilderState } from "@/types/builder";

/* ==========================================
   Quote Helpers
========================================== */

function generateQuoteNumber() {
  const year = new Date().getFullYear();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `QT-${year}-${random}`;
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getValidTill(days = 15) {
  const date = new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}

/* ==========================================
   Initial State
========================================== */

const initialBuilderState: BuilderState = {
  services: [],

  customer: {
    name: "",
    phone: "",
    email: "",
  },

  event: {
    eventType: "",
    brideName: "",
    groomName: "",
    eventDate: "",
    venue: "",
    city: "",
    state: "",
    pincode: "",
  },

  deliverables: {
    editedPhotos: true,
    rawPhotos: false,
    cinematicFilm: true,
    teaserFilm: true,
    instagramReel: true,
    album: true,
    pendrive: false,
    cloudGallery: true,
  },

  agreement: {
    foodIncluded: false,
    travelIncluded: false,
    deliveryDays: 30,
    cancellationPolicy:
      "Booking amount is non-refundable after confirmation.",
    paymentTerms:
      "50% Advance, 30% On Event Day, 20% Before Final Delivery.",
    copyright:
      "VK Creation retains promotional usage rights unless otherwise agreed.",
  },

  discount: 0,

  gstEnabled: false,

  advancePaid: 0,

  quoteNumber: "",

  quoteDate: "",

  validTill: "",

  notes: "",
};

interface BuilderContextType {
  builder: BuilderState;
  setBuilder: React.Dispatch<
    React.SetStateAction<BuilderState>
  >;
}

const BuilderContext =
  createContext<BuilderContextType | null>(
    null
  );

export function BuilderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [builder, setBuilder] =
    useState<BuilderState>(initialBuilderState);

  useEffect(() => {
    setBuilder((prev) => {
      if (prev.quoteNumber) {
        return prev;
      }

      return {
        ...prev,
        quoteNumber: generateQuoteNumber(),
        quoteDate: getTodayDate(),
        validTill: getValidTill(),
      };
    });
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        builder,
        setBuilder,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderContext() {
  const context = useContext(
    BuilderContext
  );

  if (!context) {
    throw new Error(
      "useBuilderContext must be used inside BuilderProvider"
    );
  }

  return context;
}