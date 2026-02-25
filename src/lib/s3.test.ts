import { s3 } from "@/lib/supabase"
import {
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"

const TEST_BUCKET = "system-logos" // change to your actual bucket name
const TEST_KEY = "__connection-test/ping.txt"

async function testS3Connection() {
  console.log("🔌 Testing S3 connection...\n")

  // ── 1. List buckets ───────────────────────────────────────────────────────
  try {
    const { Buckets } = await s3.send(new ListBucketsCommand({}))
    const names = Buckets?.map((b) => b.Name).join(", ") ?? "none"
    console.log(`✅ Connected. Buckets found: ${names}`)
  } catch (err) {
    console.error("❌ Failed to list buckets:", err)
    process.exit(1) // no point continuing if credentials are wrong
  }

  // ── 2. List objects in your target bucket ─────────────────────────────────
  try {
    const { KeyCount } = await s3.send(
      new ListObjectsV2Command({ Bucket: TEST_BUCKET, MaxKeys: 5 })
    )
    console.log(`✅ Bucket "${TEST_BUCKET}" accessible. Objects (up to 5): ${KeyCount}`)
  } catch (err) {
    console.error(`❌ Cannot access bucket "${TEST_BUCKET}":`, err)
    process.exit(1)
  }

  // ── 3. Upload a test object ───────────────────────────────────────────────
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: TEST_BUCKET,
        Key: TEST_KEY,
        Body: Buffer.from("connection-ok"),
        ContentType: "text/plain",
      })
    )
    console.log(`✅ Upload OK  → ${TEST_KEY}`)
  } catch (err) {
    console.error("❌ Upload failed:", err)
    process.exit(1)
  }

  // ── 4. Delete the test object (cleanup) ───────────────────────────────────
  try {
    await s3.send(
      new DeleteObjectCommand({ Bucket: TEST_BUCKET, Key: TEST_KEY })
    )
    console.log(`✅ Cleanup OK → ${TEST_KEY} deleted`)
  } catch (err) {
    // Non-fatal — bucket write works, cleanup just failed
    console.warn("⚠️  Cleanup failed (manual delete needed):", err)
  }

  console.log("\n🎉 All checks passed. S3 connection is healthy.")
}

testS3Connection()