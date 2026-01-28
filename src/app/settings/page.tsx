import { Lock, Bell, Shield, Palette, Database } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - Project Vanguard",
  description: "Manage your account and preferences",
};

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy settings and account security",
      items: [
        { label: "Make profile public", enabled: true },
        { label: "Allow peer feedback", enabled: true },
        { label: "Show engagement scores", enabled: false },
      ],
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Control what notifications you receive",
      items: [
        { label: "Task assignments", enabled: true },
        { label: "Deadline reminders", enabled: true },
        { label: "Feedback received", enabled: true },
        { label: "Team updates", enabled: false },
      ],
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize how Vanguard looks",
      items: [
        { label: "Dark mode", enabled: true },
        { label: "Compact view", enabled: false },
      ],
    },
    {
      icon: Database,
      title: "Data & Export",
      description: "Manage your data and exports",
      items: [
        { label: "Download my data", action: true },
        { label: "Export engagement report", action: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Account Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Account Information</h2>
            <p className="text-sm text-muted-foreground">Update your account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Jordan Lee"
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                defaultValue="jordan@example.com"
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
            <textarea
              defaultValue="Passionate about full-stack development"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {settingsSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <Icon className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{item.label}</span>
                    {item.action ? (
                      <button className="px-3 py-1 rounded text-sm text-blue-500 hover:bg-blue-500/10 font-medium transition">
                        Export
                      </button>
                    ) : (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.enabled}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 rounded-full transition ${
                            item.enabled ? "bg-blue-600" : "bg-secondary"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition transform ${
                              item.enabled ? "translate-x-4" : "translate-x-0.5"
                            } mt-0.5`}
                          />
                        </div>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          These actions cannot be undone. Please proceed with caution.
        </p>
        <button className="px-4 py-2 rounded-lg border border-red-500/50 text-red-600 hover:bg-red-500/10 font-semibold transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}
