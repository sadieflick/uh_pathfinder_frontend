# UH Pathfinder
## Summary of Features:

### Choose path:
1. Highschool
2. Work Experienced

### RAISEC Questionaire
1. User survey gets the student's RAISEC Code of 3 interest areas (simple front-end logic)
2. User sees RIASEC interest radar chart, details about their interest profile
3. _Interest-Matched Jobs_: Query (batched/scheduled) for up to 150 interest-matched jobs 
4. _Interest-Job-Matched 40-Skill Sample_: By Interest Profile: Compute pre-scored 40-skill list score-adjusted by frequency of skill in interest-matched jobs

### Skills Survey: Select Tasks You've Done Before
#### Prepares to call CareerOneStop API for Skill-Job Matches
1. User chooses tasks the have done before from a panel of tasks (appropriate to work experience level)
2. User takes a 'heuristic' skills survey, to fetch skills-matched jobs from the CareerOneStop API, which will later be joined on the 150 interest-matched jobs, for a more targeted interest/job match
3. Instead of the user rating each of 40 skills 1 to 5, which causes user fatigue, we pre-score interest-weighted 40-skills, and then employ a 'binary search'/elimination approach.
4. Task statements are adapted for analagous high-school appropriate levels of tasks, to provide an approximate measure of aptitude (or affinity) for future career requirements.
5. Selecting "I've done this task before" further pre-rates 12 of the 40 skills (or more if they choose), downgrading or upgrading the score to start, based on whether or not they have performed a mid-level-competency task of this skill (anchor at 3 of 5)
6. The next step uses LLM inference to collect approximated data about the tasks they have done to refine scores through open-ended questions using the skills anchor statements for skill-level as a basis for the judgment.