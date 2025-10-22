"use client";

import { memo, useState, useRef, useCallback } from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import { Groups, Schedule, Download } from "@mui/icons-material";
import { styles } from "../../styles/promotion.mui.styles.mjs";
import { promotionData } from "./promotionData.jsx";
import { posterData } from "./posterData.jsx";
import PromotionCard from "./PromotionCard.jsx";
import PosterCard from "./PosterCard.jsx";
import NavigationChip from "./NavigationChip.jsx";
import PromotionSection from "./PromotionSection.jsx";

const Promotion = memo(function PromotionComponent() {
  const [expandedSections, setExpandedSections] = useState({
    recruitment: false,
    reminders: false,
    posters: false,
  });

  const sectionRefs = {
    recruitment: useRef(null),
    reminders: useRef(null),
    posters: useRef(null),
  };

  const handleSectionToggle = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

    const element = sectionRefs[section].current;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.focus();
    }
  }, []);

  const totalRecruitment = promotionData.recruitment.length;
  const totalReminders = promotionData.reminders.length;
  const totalPosters = posterData.length;

  const navigationChips = [
    {
      icon: <Groups aria-hidden="true" />,
      label: "Recruitment Posts",
      count: totalRecruitment,
      section: "recruitment",
    },
    { icon: <Schedule aria-hidden="true" />, label: "Event Reminders", count: totalReminders, section: "reminders" },
    { icon: <Download aria-hidden="true" />, label: "Downloadable Posters", count: totalPosters, section: "posters" },
  ];

  return (
    <Container maxWidth="md" sx={styles.pageContainer}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={styles.mainTitle} id="main-heading">
        Promotional Material
      </Typography>

      <Typography variant="h6" component="p" align="center" sx={styles.subtitle} aria-describedby="main-heading">
        Ready-to-use content to help spread the word about the Yorkshire Three Peaks Challenge
      </Typography>

      <Box sx={styles.statsContainer} role="navigation" aria-label="Quick navigation to content sections">
        {navigationChips.map((chip) => (
          <NavigationChip key={chip.section} {...chip} onClick={handleSectionToggle} />
        ))}
      </Box>

      <Typography variant="body1" sx={styles.introText}>
        Help us spread the word about the Yorkshire Three Peaks Challenge! Whether you&apos;re participating,
        volunteering, or simply supporting the cause, your promotion makes a real difference.
      </Typography>

      <Box sx={styles.guidelinesBox} role="note" aria-label="Usage guidelines">
        <Typography variant="body2" sx={styles.guidelines}>
          <strong>Usage Guidelines:</strong> Feel free to adapt these messages for your needs. Remember to update dates
          and contact details to reflect the actual event.
        </Typography>
      </Box>

      <Divider sx={styles.sectionDivider} />

      <PromotionSection
        sectionRef={sectionRefs.recruitment}
        expanded={expandedSections.recruitment}
        onToggle={() => handleSectionToggle("recruitment")}
        icon={<Groups sx={styles.sectionIcon} aria-hidden="true" />}
        title="Recruitment Announcements"
        count={totalRecruitment}
        description="Use these posts to recruit walkers and volunteers for the challenge. Perfect for social media, newsletters, and community boards."
        sectionId="recruitment"
      >
        {promotionData.recruitment.map((announcement, index) => (
          <Box key={announcement.id} role="listitem">
            <PromotionCard
              announcement={announcement}
              ariaLabel={`Recruitment announcement ${index + 1} of ${totalRecruitment}: ${announcement.title}`}
            />
          </Box>
        ))}
      </PromotionSection>

      <PromotionSection
        sectionRef={sectionRefs.reminders}
        expanded={expandedSections.reminders}
        onToggle={() => handleSectionToggle("reminders")}
        icon={<Schedule sx={styles.sectionIcon} aria-hidden="true" />}
        title="Event Reminders"
        count={totalReminders}
        description="Keep participants engaged with these timely reminders. Send at key milestones leading up to the event."
        sectionId="reminders"
      >
        {promotionData.reminders.map((announcement, index) => (
          <Box key={announcement.id} role="listitem">
            <PromotionCard
              announcement={announcement}
              ariaLabel={`Event reminder ${index + 1} of ${totalReminders}: ${announcement.title}`}
            />
          </Box>
        ))}
      </PromotionSection>

      <PromotionSection
        sectionRef={sectionRefs.posters}
        expanded={expandedSections.posters}
        onToggle={() => handleSectionToggle("posters")}
        icon={<Download sx={styles.sectionIcon} aria-hidden="true" />}
        title="Downloadable Posters"
        count={totalPosters}
        description="High-quality SVG posters ready for print or digital use. Perfect for notice boards, websites, and social media."
        sectionId="posters"
      >
        {posterData.map((poster, index) => (
          <Box key={poster.title} role="listitem">
            <PosterCard {...poster} ariaLabel={`${poster.title} - ${index + 1} of ${totalPosters} posters`} />
          </Box>
        ))}
      </PromotionSection>
    </Container>
  );
});

export default Promotion;
