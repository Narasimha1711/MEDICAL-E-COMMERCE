import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TeamSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const team = [
    {
      name: 'jenny',
      title: 'Chief Executive Officer',
      image: 'https://i.pravatar.cc/150?img=1',
      bio: 'Leading with vision and innovation'
    },
    {
      name: 'Tharun',
      title: 'Head of Operations',
      image: 'https://i.pravatar.cc/150?img=2',
      bio: 'Optimizing delivery networks'
    },
    {
      name: 'Surya',
      title: 'Lead Pharmacist',
      image: 'https://i.pravatar.cc/150?img=3',
      bio: 'Ensuring medication safety'
    },
    {
      name: 'Anand',
      title: 'Tech Lead',
      image: 'https://i.pravatar.cc/150?img=4',
      bio: 'Building the future of healthcare'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="team-section" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Meet Our Team
      </motion.h2>
      <motion.div
        className="team-grid"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {team.map((member) => (
          <motion.div
            key={member.name}
            className="team-member"
            variants={itemVariants}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div className="member-image-container">
              <img src={member.image} alt={member.name} className="member-image" />
            </div>
            <h3>{member.name}</h3>
            <p className="member-title">{member.title}</p>
            <p className="member-bio">{member.bio}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TeamSection;