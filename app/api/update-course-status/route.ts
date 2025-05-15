import { NextResponse } from "next/server"

const PIPEFY_API_URL = "https://api.pipefy.com/graphql"
const PIPEFY_API_KEY = process.env.PIPEFY_API_KEY

if (!PIPEFY_API_KEY) {
  throw new Error("PIPEFY_API_KEY is not set in the environment variables")
}

const updateCardFieldMutation = `
  mutation UpdateCardField($input: UpdateCardFieldInput!) {
    updateCardField(input: $input) {
      success
    }
  }
`

export async function POST(req: Request) {
  const { courseId, status } = await req.json()

  if (!courseId || !status) {
    return NextResponse.json({ error: "Course ID and status are required" }, { status: 400 })
  }

  try {
    const response = await fetch(PIPEFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PIPEFY_API_KEY}`,
      },
      body: JSON.stringify({
        query: updateCardFieldMutation,
        variables: {
          input: {
            card_id: courseId,
            field_id: "status_p_s_comit",
            new_value: status,
          },
        },
      }),
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    return NextResponse.json({ success: true, status: status })
  } catch (error) {
    console.error("Error updating course status:", error)
    return NextResponse.json({ error: "Failed to update course status" }, { status: 500 })
  }
}
