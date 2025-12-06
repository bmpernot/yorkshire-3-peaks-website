function generateActions({ team, updatedTeam, deletingTeam }) {
  const actions = [];
  if (deletingTeam) {
    actions.push({ action: "delete", type: "entry" });
    return actions;
  }

  if (team.teamName !== updatedTeam.teamName) {
    actions.push({ action: "modify", type: "teamName", newValues: updatedTeam.teamName });
  }

  team.members.forEach((member) => {
    if (!updatedTeam.members.map((member) => member.userId).includes(member.userId)) {
      actions.push({ action: "delete", type: "member", newValues: { userId: member.userId } });
    }
  });

  updatedTeam.members.forEach((updatedMember) => {
    const existingMember = team.members.find((existingMember) => existingMember.userId === updatedMember.userId);
    if (!existingMember) {
      actions.push({
        action: "add",
        type: "member",
        newValues: {
          userId: updatedMember.userId,
          additionalRequirements: updatedMember.additionalRequirements || null,
          willingToVolunteer: updatedMember.willingToVolunteer || false,
        },
      });
    } else {
      if (
        existingMember.additionalRequirements !== updatedMember.additionalRequirements ||
        existingMember.willingToVolunteer !== updatedMember.willingToVolunteer
      ) {
        actions.push({
          action: "modify",
          type: "member",
          newValues: {
            userId: updatedMember.userId,
            additionalRequirements: updatedMember.additionalRequirements || null,
            willingToVolunteer: updatedMember.willingToVolunteer || false,
          },
        });
      }
    }
  });

  return actions;
}

export default generateActions;
