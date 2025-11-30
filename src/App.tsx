import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { CreateAssessment } from "./components/CreateAssessment";
import { TakeAssessment } from "./components/TakeAssessment";
import { AssessmentResults } from "./components/AssessmentResults";
import { Navigation } from "./components/Navigation";
import { CampaignWizard } from "./components/CampaignWizard";
import { ParticipantsManagement } from "./components/ParticipantsManagement";
import { SurveyManagement } from "./components/SurveyManagement";
import { NotificationsManagement } from "./components/NotificationsManagement";
import { AssessmentForm } from "./components/AssessmentForm";
import { DetailedReports } from "./components/DetailedReports";
import { UserProfile } from "./components/UserProfile";
import { Settings } from "./components/Settings";

export type View =
  | "dashboard"
  | "create"
  | "take"
  | "results"
  | "campaign-wizard"
  | "participants"
  | "surveys"
  | "notifications"
  | "assessment-form"
  | "detailed-reports"
  | "profile"
  | "settings";
export type UserRole = "admin" | "employee";

export interface Assessment {
  id: string;
  name: string;
  project: string;
  createdDate: string;
  participants: number;
  completed: number;
  status: "draft" | "published" | "completed";
}

export interface AssessmentResponse {
  assessmentId: string;
  participantName: string;
  participantRole: "self" | "manager" | "peer" | "subordinate";
  responses: { [competencyId: string]: number };
  submittedDate: string;
}

export default function App() {
  const [currentView, setCurrentView] =
    useState<View>("dashboard");
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("admin");

  const handleViewChange = (
    view: View,
    assessment?: Assessment,
  ) => {
    setCurrentView(view);
    if (assessment) {
      setSelectedAssessment(assessment);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentView}
        onNavigate={handleViewChange}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "dashboard" && (
          <Dashboard
            onNavigate={handleViewChange}
            userRole={userRole}
          />
        )}

        {currentView === "campaign-wizard" && (
          <CampaignWizard
            onBack={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "participants" && (
          <ParticipantsManagement />
        )}

        {currentView === "surveys" && <SurveyManagement />}

        {currentView === "notifications" && (
          <NotificationsManagement />
        )}

        {currentView === "create" && (
          <CreateAssessment
            onBack={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "take" && selectedAssessment && (
          <TakeAssessment
            assessment={selectedAssessment}
            onBack={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "results" && selectedAssessment && (
          <AssessmentResults
            assessment={selectedAssessment}
            onBack={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "assessment-form" &&
          selectedAssessment && (
            <AssessmentForm
              assessment={selectedAssessment}
              onBack={() => setCurrentView("dashboard")}
            />
          )}

        {currentView === "detailed-reports" &&
          selectedAssessment && (
            <DetailedReports
              assessment={selectedAssessment}
              onBack={() => setCurrentView("dashboard")}
            />
          )}

        {currentView === "profile" && <UserProfile />}

        {currentView === "settings" && <Settings />}
      </div>
    </div>
  );
}