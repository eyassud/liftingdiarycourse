import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { exercises, workouts, workoutExercises, sets } from './schema'

const db = drizzle(process.env.DATABASE_URL!)

async function seed() {
  console.log('Clearing existing data...')
  await db.delete(sets)
  await db.delete(workoutExercises)
  await db.delete(workouts)
  await db.delete(exercises)

  console.log('Seeding exercises...')
  const [squat, bench, deadlift, ohp, row, pullup, lunge, curl] = await db
    .insert(exercises)
    .values([
      { name: 'Barbell Back Squat' },
      { name: 'Barbell Bench Press' },
      { name: 'Conventional Deadlift' },
      { name: 'Overhead Press' },
      { name: 'Barbell Row' },
      { name: 'Pull-up' },
      { name: 'Bulgarian Split Squat' },
      { name: 'Barbell Curl' },
    ])
    .returning()

  console.log('Seeding workouts...')
  const userId = 'user_demo_001'

  // Workout 1 — Push day, 3 days ago
  const [w1] = await db
    .insert(workouts)
    .values({
      userId,
      name: 'Push Day A',
      startedAt: new Date('2026-06-13T07:00:00Z'),
      completedAt: new Date('2026-06-13T08:15:00Z'),
    })
    .returning()

  const [we1a, we1b, we1c] = await db
    .insert(workoutExercises)
    .values([
      { workoutId: w1.id, exerciseId: bench.id, order: 1 },
      { workoutId: w1.id, exerciseId: ohp.id, order: 2 },
      { workoutId: w1.id, exerciseId: curl.id, order: 3 },
    ])
    .returning()

  await db.insert(sets).values([
    { workoutExerciseId: we1a.id, setNumber: 1, reps: 5, weight: '80.00' },
    { workoutExerciseId: we1a.id, setNumber: 2, reps: 5, weight: '80.00' },
    { workoutExerciseId: we1a.id, setNumber: 3, reps: 4, weight: '80.00' },
    { workoutExerciseId: we1b.id, setNumber: 1, reps: 8, weight: '50.00' },
    { workoutExerciseId: we1b.id, setNumber: 2, reps: 7, weight: '50.00' },
    { workoutExerciseId: we1b.id, setNumber: 3, reps: 6, weight: '50.00' },
    { workoutExerciseId: we1c.id, setNumber: 1, reps: 12, weight: '25.00' },
    { workoutExerciseId: we1c.id, setNumber: 2, reps: 10, weight: '25.00' },
    { workoutExerciseId: we1c.id, setNumber: 3, reps: 10, weight: '25.00' },
  ])

  // Workout 2 — Pull day, 2 days ago
  const [w2] = await db
    .insert(workouts)
    .values({
      userId,
      name: 'Pull Day A',
      startedAt: new Date('2026-06-14T07:30:00Z'),
      completedAt: new Date('2026-06-14T08:45:00Z'),
    })
    .returning()

  const [we2a, we2b, we2c] = await db
    .insert(workoutExercises)
    .values([
      { workoutId: w2.id, exerciseId: deadlift.id, order: 1 },
      { workoutId: w2.id, exerciseId: row.id, order: 2 },
      { workoutId: w2.id, exerciseId: pullup.id, order: 3 },
    ])
    .returning()

  await db.insert(sets).values([
    { workoutExerciseId: we2a.id, setNumber: 1, reps: 5, weight: '120.00' },
    { workoutExerciseId: we2a.id, setNumber: 2, reps: 5, weight: '120.00' },
    { workoutExerciseId: we2a.id, setNumber: 3, reps: 5, weight: '120.00' },
    { workoutExerciseId: we2b.id, setNumber: 1, reps: 8, weight: '70.00' },
    { workoutExerciseId: we2b.id, setNumber: 2, reps: 8, weight: '70.00' },
    { workoutExerciseId: we2b.id, setNumber: 3, reps: 7, weight: '70.00' },
    { workoutExerciseId: we2c.id, setNumber: 1, reps: 8, weight: null },
    { workoutExerciseId: we2c.id, setNumber: 2, reps: 7, weight: null },
    { workoutExerciseId: we2c.id, setNumber: 3, reps: 6, weight: null },
  ])

  // Workout 3 — Leg day, today (in progress, no completedAt)
  const [w3] = await db
    .insert(workouts)
    .values({
      userId,
      name: 'Leg Day A',
      startedAt: new Date('2026-06-16T06:00:00Z'),
      completedAt: new Date('2026-06-16T07:20:00Z'),
    })
    .returning()

  const [we3a, we3b] = await db
    .insert(workoutExercises)
    .values([
      { workoutId: w3.id, exerciseId: squat.id, order: 1 },
      { workoutId: w3.id, exerciseId: lunge.id, order: 2 },
    ])
    .returning()

  await db.insert(sets).values([
    { workoutExerciseId: we3a.id, setNumber: 1, reps: 5, weight: '100.00' },
    { workoutExerciseId: we3a.id, setNumber: 2, reps: 5, weight: '100.00' },
    { workoutExerciseId: we3a.id, setNumber: 3, reps: 5, weight: '100.00' },
    { workoutExerciseId: we3b.id, setNumber: 1, reps: 10, weight: '40.00' },
    { workoutExerciseId: we3b.id, setNumber: 2, reps: 10, weight: '40.00' },
    { workoutExerciseId: we3b.id, setNumber: 3, reps: 9, weight: '40.00' },
  ])

  console.log('Seed complete.')
  console.log(`  ${8} exercises`)
  console.log(`  ${3} workouts`)
  console.log(`  ${9} workout_exercises`)
  console.log(`  ${27} sets`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
