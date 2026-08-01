// Tipos compartidos de dominio para VIDAFIT TRAINING

export type UserRole = "student" | "coach";
export type WorkoutStatus = "draft" | "published";
export type BlockType =
  | "warmup"
  | "strength"
  | "skill"
  | "conditioning"
  | "accessory"
  | "cooldown"
  | "coach_notes";
export type AssignmentState = "scheduled" | "completed" | "rest";

export const BLOCK_LABELS: Record<BlockType, string> = {
  warmup: "WARM UP",
  strength: "STRENGTH",
  skill: "SKILL",
  conditioning: "CONDITIONING",
  accessory: "ACCESSORY",
  cooldown: "COOLDOWN",
  coach_notes: "COACH NOTES",
};

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_by: string | null;
  created_at: string;
}

export interface WorkoutSection {
  id: string;
  workout_id: string;
  block_type: BlockType;
  title: string;
  description: string | null;
  content: string;
  position: number;
}

export interface Workout {
  id: string;
  title: string;
  scheduled_date: string; // YYYY-MM-DD
  group_id: string;
  status: WorkoutStatus;
  is_rest_day: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  workout_sections?: WorkoutSection[];
  groups?: Pick<Group, "id" | "name" | "color">;
}

export interface WorkoutAssignment {
  id: string;
  workout_id: string;
  profile_id: string;
  state: AssignmentState;
  completed_at: string | null;
  result_text: string | null;
  result_value: number | null;
}
