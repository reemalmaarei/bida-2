-- Seed milestone data for all assessment months
-- Each assessment month has 5 domains with 2 milestones each

-- Assessment month 2
INSERT INTO milestones (assessment_month, domain, title, description, order_index) VALUES
(2, 'problem_solving', 'Follows moving object with eyes', 'Baby tracks objects moving slowly across their field of vision', 1),
(2, 'problem_solving', 'Looks at faces', 'Baby focuses on faces and maintains eye contact', 2),
(2, 'communication', 'Makes cooing sounds', 'Baby produces vowel sounds like "ooh" and "ahh"', 3),
(2, 'communication', 'Responds to sounds', 'Baby turns head toward sounds and voices', 4),
(2, 'personal_social', 'Social smile', 'Baby smiles in response to your smile', 5),
(2, 'personal_social', 'Calms when spoken to', 'Baby quiets down when hearing familiar voice', 6),
(2, 'gross_motor', 'Lifts head when on tummy', 'Baby can raise head 45 degrees during tummy time', 7),
(2, 'gross_motor', 'Smooth arm and leg movements', 'Baby moves arms and legs smoothly, not jerky', 8),
(2, 'fine_motor', 'Brings hands to mouth', 'Baby can bring their hands to their mouth', 9),
(2, 'fine_motor', 'Opens and closes hands', 'Baby opens and shuts hands repeatedly', 10);

-- Assessment month 4
INSERT INTO milestones (assessment_month, domain, title, description, order_index) VALUES
(4, 'problem_solving', 'Reaches for toys', 'Baby reaches for and grasps toys within reach', 1),
(4, 'problem_solving', 'Brings hands to midline', 'Baby brings both hands together at chest', 2),
(4, 'communication', 'Babbles with expression', 'Baby makes consonant sounds like "ba", "da"', 3),
(4, 'communication', 'Laughs out loud', 'Baby laughs in response to play', 4),
(4, 'personal_social', 'Enjoys playing with people', 'Baby shows excitement during interactive play', 5),
(4, 'personal_social', 'Recognizes familiar people', 'Baby shows different responses to familiar vs unfamiliar people', 6),
(4, 'gross_motor', 'Holds head steady', 'Baby holds head upright without support', 7),
(4, 'gross_motor', 'Pushes up on elbows', 'Baby pushes up on elbows during tummy time', 8),
(4, 'fine_motor', 'Holds a bottle', 'Baby can hold bottle with both hands', 9),
(4, 'fine_motor', 'Brings objects to mouth', 'Baby explores objects by mouthing them', 10);

-- Assessment month 6
INSERT INTO milestones (assessment_month, domain, title, description, order_index) VALUES
(6, 'problem_solving', 'Looks for dropped objects', 'Baby looks for things that fall out of sight', 1),
(6, 'fine_motor', 'Transfers objects hand to hand', 'Baby passes toys from one hand to the other', 2),
(6, 'communication', 'Responds to name', 'Baby turns and looks when you call their name', 3),
(6, 'communication', 'Makes different sounds', 'Baby strings vowels together and makes various sounds', 4),
(6, 'personal_social', 'Shows stranger anxiety', 'Baby may be wary of unfamiliar people', 5),
(6, 'personal_social', 'Responds to emotions', 'Baby responds to your happy or sad expressions', 6),
(6, 'gross_motor', 'Rolls both ways', 'Baby rolls from tummy to back and back to tummy', 7),
(6, 'gross_motor', 'Sits with support', 'Baby sits with hands for support', 8),
(6, 'personal_social', 'Begins eating solids', 'Baby opens mouth for spoon and swallows purees', 9),
(6, 'problem_solving', 'Explores cause and effect', 'Baby drops objects to see what happens', 10);

-- Sample Try It guides
INSERT INTO try_it_guides (milestone_id, title, instructions, tips) VALUES
((SELECT id FROM milestones WHERE title = 'Follows moving object with eyes' LIMIT 1),
 'Practice Visual Tracking',
 '1. Hold a colorful toy about 10-12 inches from baby''s face
2. Slowly move the toy from side to side
3. Watch if baby''s eyes follow the toy
4. Move toy up and down slowly
5. Make sure room is well-lit',
 'Use high-contrast toys like black and white patterns. Try this when baby is alert but calm.'),

((SELECT id FROM milestones WHERE title = 'Social smile' LIMIT 1),
 'Encourage Social Smiling',
 '1. Get close to baby''s face (about 8-10 inches)
2. Make eye contact and smile broadly
3. Talk in a happy, sing-song voice
4. Wait for baby to respond
5. When baby smiles, respond with excitement',
 'Best time is when baby is fed and rested. Be patient - it may take several tries!'),

((SELECT id FROM milestones WHERE title = 'Lifts head when on tummy' LIMIT 1),
 'Tummy Time Practice',
 '1. Place baby on firm, flat surface on their tummy
2. Get down to baby''s level
3. Use toys or your voice to encourage looking up
4. Start with 3-5 minutes, several times daily
5. Always supervise tummy time',
 'Try tummy time when baby is most alert. Place a mirror in front for extra motivation.');

-- Sample resources
INSERT INTO resources (title, description, content, category) VALUES
('Understanding Developmental Milestones',
 'A guide to child development stages',
 'Every child develops at their own pace, but there are general milestones that help track progress...',
 'development'),

('Sleep Training Basics',
 'Helping your baby develop healthy sleep habits',
 'Good sleep is essential for your baby''s growth and development...',
 'sleep'),

('Introduction to Solid Foods',
 'When and how to start solid foods',
 'Starting solids is an exciting milestone. Most babies are ready around 6 months...',
 'nutrition');

-- Sample experts
INSERT INTO experts (name, title, specialty, bio, contact_info) VALUES
('Dr. Sarah Johnson', 'Pediatrician', 'Child Development', 
 'Board-certified pediatrician with 15 years of experience in early childhood development.',
 '{"email": "sarah.johnson@example.com", "availability": "Mon-Fri 9am-5pm"}'),

('Maria Garcia', 'Child Psychologist', 'Behavioral Development',
 'Specializes in infant and toddler behavioral development and parent coaching.',
 '{"email": "maria.garcia@example.com", "availability": "Tue-Thu 10am-6pm"}'),

('Dr. James Wilson', 'Occupational Therapist', 'Motor Skills Development',
 'Expert in fine and gross motor skill development in children 0-5 years.',
 '{"email": "james.wilson@example.com", "availability": "Mon-Wed 8am-4pm"}');