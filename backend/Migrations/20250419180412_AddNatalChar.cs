using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNatalChar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NatalCharts_AspNetUsers_UserId",
                table: "NatalCharts");

            migrationBuilder.DropIndex(
                name: "IX_NatalCharts_UserId",
                table: "NatalCharts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "NatalCharts",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_NatalCharts_UserId",
                table: "NatalCharts",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_NatalCharts_AspNetUsers_UserId",
                table: "NatalCharts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NatalCharts_AspNetUsers_UserId",
                table: "NatalCharts");

            migrationBuilder.DropIndex(
                name: "IX_NatalCharts_UserId",
                table: "NatalCharts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "NatalCharts",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NatalCharts_UserId",
                table: "NatalCharts",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NatalCharts_AspNetUsers_UserId",
                table: "NatalCharts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
