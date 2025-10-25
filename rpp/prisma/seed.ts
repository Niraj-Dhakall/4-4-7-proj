import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  // await prisma.projects.deleteMany({})
  // await prisma.managers.deleteMany({})
  // await prisma.students.deleteMany({})

  // console.log('Cleared existing data')

  // 1️⃣ Upsert Managers
  const manager1 = await prisma.managers.upsert({
    where: { email: "alice@techcorp.com" },
    update: {
      name: "Alice Johnson",
      affiliation: "TechCorp Inc.",
      password: "hashedpassword123",
      code: "TC-ALICE-001",
    },
    create: {
      name: "Alice Johnson",
      affiliation: "TechCorp Inc.",
      email: "alice@techcorp.com",
      password: "hashedpassword123",
      code: "TC-ALICE-001",
    },
  })

  const manager2 = await prisma.managers.upsert({
    where: { email: "bob@innovatelabs.com" },
    update: {
      name: "Bob Smith",
      affiliation: "Innovate Labs",
      password: "hashedpassword456",
      code: "IL-BOB-002",
    },
    create: {
      name: "Bob Smith",
      affiliation: "Innovate Labs",
      email: "bob@innovatelabs.com",
      password: "hashedpassword456",
      code: "IL-BOB-002",
      projects:[],
    },
  })

  console.log(`Upserted managers: ${manager1.name}, ${manager2.name}`)

  // 2️⃣ Insert or Find Projects (linked to managers)
  let project1 = await prisma.projects.findFirst({
    where: {
      title: "AI Resume Analyzer",
      project_manager_id: manager1.id,
    },
  })

  if (!project1) {
    project1 = await prisma.projects.create({
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
    console.log(`Created project: ${project1.title}`)
  } else {
    console.log(`Found existing project: ${project1.title}`)
  }

  let project2 = await prisma.projects.findFirst({
    where: {
      title: "Campus Navigator App",
      project_manager_id: manager2.id,
    },
  })

  if (!project2) {
    project2 = await prisma.projects.create({
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
    console.log(`Created project: ${project2.title}`)
  } else {
    console.log(`Found existing project: ${project2.title}`)
  }

  // 3️⃣ Insert or Find Students
  let student1 = await prisma.students.findFirst({
    where: { name: "Niraj Dhakal" },
  })

  if (!student1) {
    student1 = await prisma.students.create({
      data: {
        name: "Niraj Dhakal",
        major: {
          level: "Bachelor's",
          name: "Computer Science",
          gradYear: "2026"
        } as any,
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
    console.log(`Created student: ${student1.name}`)
  } else {
    console.log(`Found existing student: ${student1.name}`)
  }

  let student2 = await prisma.students.findFirst({
    where: { name: "Emily Rivera" },
  })

  if (!student2) {
    student2 = await prisma.students.create({
      data: {
        name: "Emily Rivera",
        major: {
          level: "Bachelor's",
          name: "Information Systems",
          gradYear: "2027"
        } as any,
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
    console.log(`Created student: ${student2.name}`)
  } else {
    console.log(`Found existing student: ${student2.name}`)
  }

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
