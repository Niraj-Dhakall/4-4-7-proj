import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.projects.deleteMany({})
  await prisma.managers.deleteMany({})
  await prisma.students.deleteMany({})

  console.log('Cleared existing data')

  // 1️⃣ Insert Managers
  const manager1 = await prisma.managers.create({
    data: {
      name: "Alice Johnson",
      affiliation: "TechCorp Inc.",
      email: "alice@techcorp.com",
      password: "hashedpassword123",
      code: "TC-ALICE-001",
    },
  })

  const manager2 = await prisma.managers.create({
    data: {
      name: "Bob Smith",
      affiliation: "Innovate Labs",
      email: "bob@innovatelabs.com",
      password: "hashedpassword456",
      code: "IL-BOB-002",
      projects:[],
    },
  })

  console.log(`Created managers: ${manager1.name}, ${manager2.name}`)

  // 2️⃣ Insert Projects (linked to managers)
  const project1 = await prisma.projects.create({
    data: {
      project_manager_id: manager1.id,
      title: "AI Resume Analyzer",
      description: "An AI tool to evaluate student resumes and recommend improvements.",
      tags: ["AI", "NLP", "CareerTech"],
      status: "Open",
      friendly: true,
      student_app: [],
      student_accepted: [],
    },
  })

  const project2 = await prisma.projects.create({
    data: {
      project_manager_id: manager2.id,
      title: "Campus Navigator App",
      description: "A mobile app to help students find classrooms and resources on campus.",
      tags: ["Mobile", "Map", "Campus"],
      status: "In Progress",
      friendly: false,
      student_app: [],
      student_accepted: [],
    },
  })

  console.log(`Created projects: ${project1.title}, ${project2.title}`)

  // 3️⃣ Insert Students
  const student1 = await prisma.students.create({
    data: {
      name: "Niraj Dhakal",
      major: ["Computer Science"],
      year: "Junior",
      gpa: 3.75,
      skills: ["React", "Node.js", "MongoDB"],
      portfolio: "https://nirajdhakal.com",
      courses: ["CMSC 201", "CMSC 331", "CMSC 411"],
      graduation: "May 2026",
      applications: [project1.id],
      accepted: [],
    },
  })

  const student2 = await prisma.students.create({
    data: {
      name: "Emily Rivera",
      major: ["Information Systems"],
      year: "Sophomore",
      gpa: 3.45,
      skills: ["Python", "Data Analysis", "SQL"],
      portfolio: null,
      courses: ["IS 300", "STAT 251"],
      graduation: "May 2027",
      applications: [project2.id],
      accepted: [project2.id],
    },
  })

  console.log(`Created students: ${student1.name}, ${student2.name}`)

  // 4️⃣ Update projects with student references
  await prisma.projects.update({
    where: { id: project1.id },
    data: {
      student_app: [student1.id],
      student_accepted: [],
    },
  })

  await prisma.projects.update({
    where: { id: project2.id },
    data: {
      student_app: [student2.id],
      student_accepted: [student2.id],
    },
  })

  console.log('Updated project-student relationships')
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
