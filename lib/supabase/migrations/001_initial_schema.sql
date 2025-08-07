-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parents table
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  onboarded BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Children table
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Developmental domains enum
CREATE TYPE developmental_domain AS ENUM (
  'communication',
  'gross_motor',
  'fine_motor',
  'problem_solving',
  'personal_social'
);

-- Response types enum
CREATE TYPE milestone_response AS ENUM (
  'yes',
  'not_yet',
  'try_it'
);

-- Activity states enum
CREATE TYPE activity_state AS ENUM (
  'active',
  'completed',
  'saved'
);

-- Milestones reference table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_month INTEGER NOT NULL,
  domain developmental_domain NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Try it guides table
CREATE TABLE try_it_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  instructions TEXT NOT NULL,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Milestone assessments table
CREATE TABLE milestone_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES milestones(id),
  assessment_month INTEGER NOT NULL,
  response milestone_response NOT NULL,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  milestone_assessment_id UUID REFERENCES milestone_assessments(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  domain developmental_domain NOT NULL,
  state activity_state DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  saved_at TIMESTAMP WITH TIME ZONE
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Experts table
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100),
  specialty VARCHAR(100),
  bio TEXT,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_children_parent_id ON children(parent_id);
CREATE INDEX idx_milestone_assessments_child_id ON milestone_assessments(child_id);
CREATE INDEX idx_activities_child_id ON activities(child_id);
CREATE INDEX idx_activities_state ON activities(state);
CREATE INDEX idx_milestones_assessment_month ON milestones(assessment_month);

-- Row Level Security (RLS)
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON parents FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON parents FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own children"
  ON children FOR ALL
  USING (parent_id::text = auth.uid()::text);

CREATE POLICY "Users can view their children's assessments"
  ON milestone_assessments FOR ALL
  USING (
    child_id IN (
      SELECT id FROM children WHERE parent_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage their children's activities"
  ON activities FOR ALL
  USING (
    child_id IN (
      SELECT id FROM children WHERE parent_id::text = auth.uid()::text
    )
  );