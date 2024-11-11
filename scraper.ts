import axios from "axios";
import { load } from "cheerio";
import { writeToPath } from "@fast-csv/format";

type PassingStats = {
    Player?: string;
    PassesCompleted?: string;
    PassesAttempted?: string;
};

async function scrapeSite() {
    const response = await axios.get("https://fbref.com/en/comps/Big5/passing/players/Big-5-European-Leagues-Stats");
    const html = response.data;
    const $ = load(html);

    const passingStats: PassingStats[] = [];

    $('table.stats_table tbody tr').each((_, element) => {
        const player = $(element).find('td[data-stat="player"]').text();
        const passesCompleted = $(element).find('td[data-stat="passes_completed"]').text();
        const passesAttempted = $(element).find('td[data-stat="passes"]').text();

        const stat: PassingStats = {
            Player: player,
            PassesCompleted: passesCompleted,
            PassesAttempted: passesAttempted
        };

        passingStats.push(stat);
    });

    writeToPath("passing_stats.csv", passingStats, { headers: true })
        .on("error", error => console.error(error))
        .on("finish", () => console.log("Success"));
}

scrapeSite();