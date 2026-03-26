$db_schema = Get-Content docs\database-schema.md
$index = $null
for ($i = 0; $i -lt $db_schema.Length; $i++) {
    if ($db_schema[$i] -match "### 5. summaries") {
        $index = $i - 1
        break
    }
}
if ($index -ne $null) {
    $newContent = @(
        "---",
        "",
        "### 4.5. session_feedbacks",
        "",
        "**Description:** AI-generated evaluation and feedback on a user's performance after completing a study session.",
        "",
        "| Column | Type | Constraints | Description |",
        "|--------|------|-------------|-------------|",
        "| id | CHAR(36) | PRIMARY KEY | UUID v4 |",
        "| study_session_id | CHAR(36) | NOT NULL, FK | Parent session |",
        "| weak_areas | JSON | NULL | Array of identified weak areas |",
        "| suggested_focus | TEXT | NULL | Recommendations from AI |",
        "| overall_score | INT | NULL | Computed completion score (0-100) |",
        "| created_at | DATETIME | DEFAULT NOW() | Generation time |",
        "",
        "**Indexes:**",
        "- PRIMARY KEY: `id`",
        "- INDEX: `idx_study_session_id (study_session_id)`",
        "",
        "**Foreign Keys:**",
        "- `study_session_id` -> `study_sessions(id)` ON DELETE CASCADE",
        ""
    )
    $updatedSchema = $db_schema[0..$index] + $newContent + $db_schema[($index+1)..($db_schema.Length-1)]
    Set-Content docs\database-schema.md -Value $updatedSchema
}
