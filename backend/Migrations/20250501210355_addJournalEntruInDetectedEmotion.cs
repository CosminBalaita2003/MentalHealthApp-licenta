using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addJournalEntruInDetectedEmotion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "JournalEntryId",
                table: "DetectedEmotions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DetectedEmotions_JournalEntryId",
                table: "DetectedEmotions",
                column: "JournalEntryId");

            migrationBuilder.AddForeignKey(
                name: "FK_DetectedEmotions_JournalEntries_JournalEntryId",
                table: "DetectedEmotions",
                column: "JournalEntryId",
                principalTable: "JournalEntries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetectedEmotions_JournalEntries_JournalEntryId",
                table: "DetectedEmotions");

            migrationBuilder.DropIndex(
                name: "IX_DetectedEmotions_JournalEntryId",
                table: "DetectedEmotions");

            migrationBuilder.DropColumn(
                name: "JournalEntryId",
                table: "DetectedEmotions");
        }
    }
}
