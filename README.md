# UH Pathfinder - uhpathfinder.netlify.app
## Summary of Features:

### 1. Choose Your Path
Students select their current experience level to personalize the assessment:
- **High School Students**: Get age-appropriate task statements and career exploration
- **Work-Experienced Professionals**: Access advanced task statements aligned with professional experience

### 2. RIASEC Interest Assessment
**Discover Your Career Interests**
1. **Interactive Quiz**: 30 engaging questions about activities and work preferences using emoji-based rating (Strongly Dislike → Strongly Like)
2. **Multi-Page Experience**: Questions presented 6 at a time with visual progress tracking
3. **Instant Calculation**: Frontend computes your 3-letter RIASEC code (e.g., "RIA", "SEC") identifying your top interest areas:
   - **R**ealistic (hands-on, practical work)
   - **I**nvestigative (analytical, research-oriented)
   - **A**rtistic (creative, expressive)
   - **S**ocial (helping, teaching)
   - **E**nterprising (leading, persuading)
   - **C**onventional (organized, detail-oriented)

4. **Interest Summary Review**: 
   - Visual radar chart showing strength across all 6 RIASEC dimensions
   - Detailed descriptions of your top 3 interest areas
   - Ability to edit responses before proceeding

5. **Interest-Matched Jobs**: 
   - Backend queries `riasec.interest_matched_jobs` table for up to 20 career matches
   - Jobs pre-scored and ranked by fit with your interest profile
   - Real O*NET occupation titles and codes

6. **Skills Panel Generation**: 
   - Automatically receives 40 baseline CareerOneStop skills
   - Skills pre-scored and weighted by frequency in your interest-matched occupations
   - Ready for personalization in the next phase

### 3. Skills Assessment: Task Selection Survey
**Validate Your Skills Through Real-World Experience**

Rather than asking users to self-rate 40 abstract skills (causing fatigue), we use a task-based approach:

1. **Task-Based Validation**: 
   - Users review concrete task statements (e.g., "Taught someone how to do something")
   - Select tasks they've actually performed
   - Experience-appropriate statements for high school vs. professional paths

2. **Binary Selection Process**:
   - Simple "I've done this" vs. "I haven't done this" choices
   - No complex 1-5 rating scales at this stage
   - Progressive presentation (can answer more tasks to refine results)

3. **Intelligent Skill Mapping**:
   - Each task statement maps to 2-3 of the 40 CareerOneStop skills
   - Backend uses task selections to adjust baseline skill scores
   - Selecting a task upgrades related skills to "mid-level competency" (anchor at 3 of 5)

4. **Skills Summary Review**:
   - Shows which tasks you've completed
   - Displays implied skill strengths
   - Option to answer more tasks for better accuracy
   - Edit or clear selections before proceeding

### 4. Skills Narrative: Tell Your Story
**Refine Matches with Context**

1. **Contextual Prompt**: 
   - System identifies your top 3 strongest skills from task selections
   - Asks for a specific example where you used these skills

2. **Open-Ended Input**:
   - 300-500 character narrative text box
   - Example prompts guide users (STAR format encouraged)
   - Optional step (can skip to see results immediately)

3. **LLM Enhancement** (Planned):
   - Future integration will use AI to parse narrative
   - Extract evidence of skill proficiency levels
   - Adjust skill ratings based on demonstrated competency
   - Use O*NET anchor statements (1-5 scale) as evaluation criteria

### 5. Career Matches: Interactive Results Map
**Explore Your Personalized Career Options**

1. **Visual Career Constellation**:
   - Up to 20 matched occupations displayed in orbital rings
   - Desktop: 3 concentric orbits (inner 6, middle 7, outer 7 positions)
   - Mobile: 2 orbits with 8 positions optimized for smaller screens
   - Color-coded by career family with smooth animations

2. **Match Scoring Display**:
   - Each occupation shows confidence score (75-95% range)
   - Hover cards reveal quick details:
     - Median salary
     - Growth outlook
     - Training duration
   - Click any occupation to explore full details

3. **Navigation Options**:
   - Review/edit interest profile
   - Review/edit skills selections
   - Clear and restart from any stage

### 6. Occupation Details: Your Pathway to Success
**Comprehensive Career Information + Education Roadmap**

When you select an occupation, see everything you need to plan your path:

#### Occupation Overview
- Full job title and O*NET code
- Detailed description of the role
- Key responsibilities and work activities
- Required skills and knowledge areas

#### Salary & Outlook
- Median salary information
- Job growth projections
- Industry demand indicators

#### Education Pathway Map
**Visual flowchart showing your route from training to career:**

1. **Training & Certificates** (6 months - 1 year):
   - Short-term certificates from UH community colleges
   - Fast-track programs and bootcamps
   - Amber color-coded section

2. **Community College** (2-year programs):
   - Associate degrees (AS, AAS)
   - Foundational programs
   - Emerald color-coded section

3. **University** (4-year programs):
   - Bachelor's degrees (BA, BS)
   - Advanced study programs
   - Blue color-coded section

4. **Career Entry Point**:
   - Visual arrow showing progression to the occupation
   - Indicates completion milestone

#### Program Cards
Each education program displays:
- **Institution**: UH campus (Honolulu CC, UH Mānoa, etc.)
- **Location**: Island and campus (e.g., "Honolulu, Oʻahu")
- **Degree Type**: Certificate, Associate, or Bachelor's
- **Duration**: Time to completion (1-4 years)
- **Total Credits**: Credit hours required (24-124)
- **Cost**: Per-credit rate + estimated total
  - In-state: $135/credit (community colleges)
  - In-state: $348/credit (UH 4-year)
- **Delivery Mode**: In-person, online, hybrid, or evening options
- **Program Description**: Overview of curriculum focus
- **Direct Link**: URL to official program page

#### Real Hawaii Data
- All programs from actual UH System institutions
- Current tuition rates (2024-2025)
- Real program names and descriptions
- Verified campus locations across all islands

#### Responsive Design
- **Desktop**: Horizontal pathway flow (left to right)
- **Mobile**: Vertical pathway flow (top to bottom)
- Smooth transitions and modern UI
- Legend showing program type counts

### 7. Data Architecture
**Comprehensive Backend Integration**

- **O*NET Database**: 887 occupations with full metadata
- **RIASEC Schema**: Pre-calculated interest-to-occupation matches
- **UH Programs Database**: Real programs with associations to occupations
- **Skills Framework**: 40 CareerOneStop skills with anchor definitions
- **RAG Pipeline** (In Progress): Vector embeddings for intelligent program discovery

---

## Technical Implementation Highlights

### Frontend (React + TypeScript)
- Modern component architecture with shadcn/ui
- Responsive design with Tailwind CSS
- Session storage for preserving assessment progress
- Smooth animations and transitions
- Mobile-first approach with adaptive layouts

### Backend (FastAPI + PostgreSQL)
- RESTful API with Pydantic validation
- Multi-schema database (onet, riasec, public)
- Efficient joins across 887 occupations
- Configurable result limits (1-50 jobs)
- Service/repository pattern for clean separation

### Assessment Flow
- Frontend calculates RIASEC code locally (no server round-trip)
- Backend processes code through canonical mapping (720 permutations)
- Results cached in sessionStorage for seamless navigation
- Progressive enhancement: works without narrative input

---

## Demo Script Walkthrough

1. **Start**: Select "High School" path
2. **Take Interest Quiz**: Answer 30 questions (2 minutes)
3. **Review Summary**: See your RIASEC code and radar chart
4. **Get Matches**: View 20 interest-matched careers
5. **Select Tasks**: Choose tasks you've done (10-15 selections recommended)
6. **Review Skills**: See implied skill strengths
7. **Add Context** (optional): Share a brief story about using your skills
8. **Explore Careers**: Interactive map with 20 occupations
9. **Deep Dive**: Click any career to see education pathways
10. **Plan Your Path**: Review training → community college → university options with real UH programs

---

## Key Differentiators

✅ **No Rating Fatigue**: Task-based validation instead of 40 skill ratings
✅ **Real Hawaii Data**: Actual UH System programs with current costs
✅ **Visual Pathways**: Flowchart showing progression from certificate to bachelor's
✅ **Island-Wide Coverage**: Programs from all UH campuses across all islands
✅ **Evidence-Based**: Built on O*NET occupational data + RIASEC science
✅ **Mobile-Optimized**: Full experience on phones, tablets, and desktop
✅ **Persistent Progress**: Navigate back/forth without losing data
✅ **Scalable Results**: Configurable from 10 to 50 occupation matches
✅ **Resilient Architecture**: Automatic fallback to demo data if backend unavailable

---

## Deployment & Fallback Mode

### Production Deployment
The frontend is deployed at **uhpathfinder.netlify.app** and includes intelligent fallback handling:

**With Backend (Full Experience):**
- 1,016 real occupations with O*NET data
- Dynamic salary and growth outlook information
- Real-time program associations
- Full database integration

**Without Backend (Demo Mode):**
- 15+ sample occupations with realistic data
- Pre-configured program pathways for each career
- All UI features fully functional
- Seamless user experience with representative data
- Automatic detection and graceful degradation

### Fallback Data Includes:
- Software Developers, Nurses, Marketing Managers, Teachers, Accountants, Psychologists, and more
- Complete education pathways (Certificate → Associate → Bachelor's)
- Realistic salary ranges ($28k-$135k) and growth outlooks
- Real UH System institutions and program details

**Note:** The application automatically detects backend availability and uses fallback data when needed. All features remain fully interactive and demonstrable without database deployment.