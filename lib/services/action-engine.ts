export type ActionProposal = {
  type: "pause_ad" | "adjust_budget" | "promote_creative"
  entityId: string
  payload: Record<string, unknown>
  reason: string
}

export class ActionEngine {
  private readonly enabled = false

  isEnabled() {
    return this.enabled
  }

  propose(_input: unknown): ActionProposal[] {
    // Fase 1: proposições automáticas desativadas por escopo.
    return []
  }
}
