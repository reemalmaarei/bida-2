import { Milestone } from '@/lib/types'

export const demoMilestones: Record<number, Milestone[]> = {
  2: [
    {
      id: 'demo-2-comm-1',
      assessment_month: 2,
      domain: 'communication',
      title: 'Makes cooing sounds',
      description: 'Does your baby make cooing or gurgling sounds when happy?',
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2-gross-1',
      assessment_month: 2,
      domain: 'gross_motor',
      title: 'Holds head up',
      description: 'When on tummy, can your baby hold their head up and look around?',
      order_index: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2-fine-1',
      assessment_month: 2,
      domain: 'fine_motor',
      title: 'Opens and closes hands',
      description: 'Does your baby open and close their hands?',
      order_index: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2-problem-1',
      assessment_month: 2,
      domain: 'problem_solving',
      title: 'Follows objects with eyes',
      description: 'Does your baby follow moving objects with their eyes?',
      order_index: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2-social-1',
      assessment_month: 2,
      domain: 'personal_social',
      title: 'Smiles at people',
      description: 'Does your baby smile at you when you talk or smile at them?',
      order_index: 5,
      created_at: new Date().toISOString()
    }
  ],
  4: [
    {
      id: 'demo-4-comm-1',
      assessment_month: 4,
      domain: 'communication',
      title: 'Laughs and babbles',
      description: 'Does your baby laugh out loud and babble with expression?',
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4-gross-1',
      assessment_month: 4,
      domain: 'gross_motor',
      title: 'Rolls from tummy to back',
      description: 'Can your baby roll from tummy to back?',
      order_index: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4-fine-1',
      assessment_month: 4,
      domain: 'fine_motor',
      title: 'Reaches for toys',
      description: 'Does your baby reach for toys with one hand?',
      order_index: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4-problem-1',
      assessment_month: 4,
      domain: 'problem_solving',
      title: 'Brings hands to mouth',
      description: 'Does your baby bring their hands to their mouth?',
      order_index: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4-social-1',
      assessment_month: 4,
      domain: 'personal_social',
      title: 'Recognizes familiar people',
      description: 'Does your baby recognize familiar people and smile at them?',
      order_index: 5,
      created_at: new Date().toISOString()
    }
  ],
  6: [
    {
      id: 'demo-6-comm-1',
      assessment_month: 6,
      domain: 'communication',
      title: 'Responds to name',
      description: 'Does your baby respond when you call their name?',
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-6-gross-1',
      assessment_month: 6,
      domain: 'gross_motor',
      title: 'Sits without support',
      description: 'Can your baby sit without support for a few seconds?',
      order_index: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-6-fine-1',
      assessment_month: 6,
      domain: 'fine_motor',
      title: 'Transfers objects between hands',
      description: 'Does your baby transfer objects from one hand to the other?',
      order_index: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-6-problem-1',
      assessment_month: 6,
      domain: 'problem_solving',
      title: 'Looks for dropped objects',
      description: 'Does your baby look for objects when they drop them?',
      order_index: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-6-social-1',
      assessment_month: 6,
      domain: 'personal_social',
      title: 'Shows stranger anxiety',
      description: 'Does your baby show awareness of strangers (may cry or be clingy)?',
      order_index: 5,
      created_at: new Date().toISOString()
    }
  ],
  9: [
    {
      id: 'demo-9-comm-1',
      assessment_month: 9,
      domain: 'communication',
      title: 'Says mama/dada',
      description: 'Does your baby say "mama" or "dada" with meaning?',
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-9-gross-1',
      assessment_month: 9,
      domain: 'gross_motor',
      title: 'Crawls',
      description: 'Does your baby crawl, scoot, or move around on their own?',
      order_index: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-9-fine-1',
      assessment_month: 9,
      domain: 'fine_motor',
      title: 'Pincer grasp',
      description: 'Can your baby pick up small objects with thumb and finger?',
      order_index: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-9-problem-1',
      assessment_month: 9,
      domain: 'problem_solving',
      title: 'Looks for hidden objects',
      description: 'Does your baby look for objects you hide under a cloth?',
      order_index: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-9-social-1',
      assessment_month: 9,
      domain: 'personal_social',
      title: 'Plays peek-a-boo',
      description: 'Does your baby enjoy playing peek-a-boo or pat-a-cake?',
      order_index: 5,
      created_at: new Date().toISOString()
    }
  ],
  12: [
    {
      id: 'demo-12-comm-1',
      assessment_month: 12,
      domain: 'communication',
      title: 'Says 2-3 words',
      description: 'Does your child say 2-3 words besides mama/dada?',
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-12-gross-1',
      assessment_month: 12,
      domain: 'gross_motor',
      title: 'Stands alone',
      description: 'Can your child stand alone without support?',
      order_index: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-12-fine-1',
      assessment_month: 12,
      domain: 'fine_motor',
      title: 'Puts objects in container',
      description: 'Does your child put objects in and take them out of containers?',
      order_index: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-12-problem-1',
      assessment_month: 12,
      domain: 'problem_solving',
      title: 'Explores objects',
      description: 'Does your child explore objects by shaking, banging, or throwing?',
      order_index: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-12-social-1',
      assessment_month: 12,
      domain: 'personal_social',
      title: 'Shows preferences',
      description: 'Does your child show preferences for certain people and toys?',
      order_index: 5,
      created_at: new Date().toISOString()
    }
  ]
}

// Get demo milestones for a specific assessment month
export function getDemoMilestones(month: number): Milestone[] {
  // If exact month exists, return it
  if (demoMilestones[month]) {
    return demoMilestones[month]
  }
  
  // Otherwise, find the closest available month
  const availableMonths = Object.keys(demoMilestones).map(Number).sort((a, b) => a - b)
  const closestMonth = availableMonths.reduce((prev, curr) => {
    return Math.abs(curr - month) < Math.abs(prev - month) ? curr : prev
  })
  
  // Return milestones for closest month, but update the assessment_month to match requested
  return demoMilestones[closestMonth].map(m => ({
    ...m,
    assessment_month: month,
    id: m.id.replace(`demo-${closestMonth}`, `demo-${month}`)
  }))
}