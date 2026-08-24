namespace JobPortal.Core.Entities
{
    public class JobSkill
    {
        public long JobId { get; set; }
        public Job Job { get; set; } = null!;

        public int SkillId { get; set; }
        public Skill Skill { get; set; } = null!;
    }
}
