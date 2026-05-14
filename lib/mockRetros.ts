import { RetroDetail, RetroSummary } from "@/types";

export const retroDetails: RetroDetail[] = [
  {
    id: "retro-q1-platform",
    key: "RETRO-PLT-240118",
    title: "Platform Stabilization Retro",
    teamName: "Platform Squad",
    date: "2026-01-18T10:30:00.000Z",
    participantCount: 6,
    actionCount: 3,
    status: "needs_action",
    summary:
      "Sprint boyunca deployment istikrarı arttı ancak release ownership ve test coverage tarafında takip gerektiren başlıklar çıktı.",
    wentWell: [
      {
        id: "gw-1",
        content: "Canary release süreci kesinti olmadan tamamlandı.",
        votes: 8,
      },
      {
        id: "gw-2",
        content: "Incident sonrası postmortem notları aynı gün paylaşıldı.",
        votes: 5,
      },
    ],
    wentWrong: [
      {
        id: "ww-1",
        content: "Regression test ownership net olmadığı için QA bottleneck oluştu.",
        votes: 7,
        tag: "Test",
      },
      {
        id: "ww-2",
        content: "Aksiyonların son tarihleri görünür olmadığı için takip zayıf kaldı.",
        votes: 4,
        tag: "Takip",
      },
    ],
    participants: [
      {
        id: "p-1",
        name: "Ayse Demir",
        role: "Engineering Manager",
        email: "ayse.demir@example.com",
        avatarInitials: "AD",
        attendanceStatus: "attended",
      },
      {
        id: "p-2",
        name: "Mert Yildiz",
        role: "Backend Engineer",
        email: "mert.yildiz@example.com",
        avatarInitials: "MY",
        attendanceStatus: "attended",
      },
      {
        id: "p-3",
        name: "Selin Kaya",
        role: "QA Engineer",
        email: "selin.kaya@example.com",
        avatarInitials: "SK",
        attendanceStatus: "late",
      },
      {
        id: "p-4",
        name: "Can Arslan",
        role: "Product Manager",
        email: "can.arslan@example.com",
        avatarInitials: "CA",
        attendanceStatus: "attended",
      },
      {
        id: "p-5",
        name: "Ece Inan",
        role: "Frontend Engineer",
        email: "ece.inan@example.com",
        avatarInitials: "EI",
        attendanceStatus: "attended",
      },
      {
        id: "p-6",
        name: "Deniz Acar",
        role: "DevOps Engineer",
        email: "deniz.acar@example.com",
        avatarInitials: "DA",
        attendanceStatus: "attended",
      },
    ],
    actions: [
      {
        id: "a-1",
        title: "Regression checklist tanimla",
        description: "Release oncesi minimum regression seti ve sorumluluk matrisini hazirla.",
        priority: "high",
        status: "open",
        dueDate: "2026-01-24T17:00:00.000Z",
        createdAt: "2026-01-18T12:00:00.000Z",
        assigneeId: "p-3",
        assigneeName: "Selin Kaya",
        assigneeEmail: "selin.kaya@example.com",
        reminder: {
          status: "sent",
          lastSentAt: "2026-01-21T08:30:00.000Z",
        },
      },
      {
        id: "a-2",
        title: "Aksiyon panosu gorunurlugu",
        description: "Takim dashboard'una gecikmis aksiyon ozeti ekle.",
        priority: "medium",
        status: "planned",
        dueDate: "2026-01-28T17:00:00.000Z",
        createdAt: "2026-01-18T12:15:00.000Z",
        assigneeId: "p-5",
        assigneeName: "Ece Inan",
        assigneeEmail: "ece.inan@example.com",
        reminder: {
          status: "not_sent",
        },
      },
      {
        id: "a-3",
        title: "Release owner rotasyonu belirle",
        description: "Her sprint icin primary ve backup release owner atamasi yap.",
        priority: "high",
        status: "in_progress",
        dueDate: "2026-01-22T17:00:00.000Z",
        createdAt: "2026-01-18T12:30:00.000Z",
        reminder: {
          status: "not_sent",
        },
      },
    ],
  },
  {
    id: "retro-growth-december",
    key: "RETRO-GRW-240912",
    title: "Growth Funnel Optimization Retro",
    teamName: "Growth Team",
    date: "2025-12-09T14:00:00.000Z",
    participantCount: 5,
    actionCount: 2,
    status: "completed",
    summary:
      "Deney akisi hizlandi, sprint ritmi korundu ve onceki aksiyonlarin buyuk kismi tamamlandi.",
    wentWell: [
      {
        id: "gw-3",
        content: "A/B test sonuclari haftalik sync'te net paylasildi.",
        votes: 6,
      },
      {
        id: "gw-4",
        content: "Task refinement toplantilari daha kisa ve verimli gecti.",
        votes: 4,
      },
    ],
    wentWrong: [
      {
        id: "ww-3",
        content: "Deney dokumantasyonu tek yerde toplanmadi.",
        votes: 3,
        tag: "Dokumantasyon",
      },
    ],
    participants: [
      {
        id: "p-7",
        name: "Zeynep Koc",
        role: "Growth Lead",
        email: "zeynep.koc@example.com",
        avatarInitials: "ZK",
        attendanceStatus: "attended",
      },
      {
        id: "p-8",
        name: "Emre Tas",
        role: "Data Analyst",
        email: "emre.tas@example.com",
        avatarInitials: "ET",
        attendanceStatus: "attended",
      },
      {
        id: "p-9",
        name: "Buse Aydin",
        role: "Product Designer",
        email: "buse.aydin@example.com",
        avatarInitials: "BA",
        attendanceStatus: "attended",
      },
      {
        id: "p-10",
        name: "Kaan Yildirim",
        role: "Frontend Engineer",
        email: "kaan.yildirim@example.com",
        avatarInitials: "KY",
        attendanceStatus: "attended",
      },
      {
        id: "p-11",
        name: "Melis Cakir",
        role: "Marketing Specialist",
        email: "melis.cakir@example.com",
        avatarInitials: "MC",
        attendanceStatus: "absent",
      },
    ],
    actions: [
      {
        id: "a-4",
        title: "Experiment log standardini guncelle",
        description: "Her deney icin ortak template ve owner alanini zorunlu hale getir.",
        priority: "medium",
        status: "completed",
        dueDate: "2025-12-16T17:00:00.000Z",
        createdAt: "2025-12-09T16:00:00.000Z",
        assigneeId: "p-8",
        assigneeName: "Emre Tas",
        assigneeEmail: "emre.tas@example.com",
        reminder: {
          status: "sent",
          lastSentAt: "2025-12-12T09:00:00.000Z",
        },
      },
      {
        id: "a-5",
        title: "Retro action review ritueli ekle",
        description: "Haftalik planlama basinda 10 dakikalik aksiyon review slotu ac.",
        priority: "low",
        status: "completed",
        dueDate: "2025-12-18T17:00:00.000Z",
        createdAt: "2025-12-09T16:20:00.000Z",
        assigneeId: "p-7",
        assigneeName: "Zeynep Koc",
        assigneeEmail: "zeynep.koc@example.com",
        reminder: {
          status: "not_sent",
        },
      },
    ],
  },
];

export const retroSummaries: RetroSummary[] = retroDetails.map(
  ({
    id,
    key,
    title,
    teamName,
    date,
    participantCount,
    actionCount,
    status,
  }) => ({
    id,
    key,
    title,
    teamName,
    date,
    participantCount,
    actionCount,
    status,
  })
);

export function findRetroByKey(key: string) {
  return retroDetails.find(
    (retro) => retro.key.toLowerCase() === key.trim().toLowerCase()
  );
}

export function findRetroById(id: string) {
  return retroDetails.find((retro) => retro.id === id);
}