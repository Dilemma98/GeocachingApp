import { XMLParser } from "fast-xml-parser";
import he from "he";
import { GPXCache, LogEntry } from "../../models/Cache";

export async function parseGPX(
  xmlString: string,
  username?: string,
): Promise<GPXCache[]> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (name) => name === "wpt" || name === "groundspeak:log",
  });

  const parsed = parser.parse(xmlString);
  const waypoints = parsed?.gpx?.wpt ?? [];

  return waypoints
    .filter((wpt: any) => wpt?.name?.startsWith("GC"))
    .map((wpt: any) => {
      const cache = wpt?.["groundspeak:cache"];
      const rawLogs = cache?.["groundspeak:logs"]?.["groundspeak:log"] ?? [];
      const logsArray = Array.isArray(rawLogs) ? rawLogs : [rawLogs];

      const logs: LogEntry[] = logsArray.map((log: any) => ({
        date: log?.["groundspeak:date"] ?? "",
        type: log?.["groundspeak:type"] ?? "",
        finderId: log?.["groundspeak:finder"]?.["#text"] ?? undefined,
        finderName: log?.["groundspeak:finder"]?.["#text"] ?? undefined,
        text:
          log?.["groundspeak:text"]?.["text"] ??
          log?.["groundspeak:text"] ??
          undefined,
      }));

      const found = username
        ? logs.some(
            (log) =>
              log.type === "Found it" &&
              log.finderName?.toLowerCase() === username.toLowerCase(),
          )
        : logs.some((log) => log.type === "Found it");

      const safeText = (field: any): string => {
        if (!field) return "";

        if (typeof field === "string") return field;

        if (typeof field?.["#text"] === "string") return field["#text"];

        if (typeof field?.text === "string") return field.text;

        return "";
      };

      const rawDescription =
        safeText(cache?.["groundspeak:long_description"]) ||
        safeText(cache?.["groundspeak:short_description"]) ||
        wpt?.desc ||
        "";

      const description = he.decode(rawDescription);
      const terrainValue = cache?.["groundspeak:terrain"];
      const terrain =
        terrainValue !== undefined && terrainValue !== null
          ? parseFloat(terrainValue)
          : undefined;

      return {
        code: wpt.name,
        name: cache?.["groundspeak:name"] ?? wpt.name,
        lat: parseFloat(wpt.lat),
        lng: parseFloat(wpt.lon),
        type:
          cache?.["groundspeak:type"]?.replace("Cache", "").trim() ?? undefined,
        difficulty: cache?.["groundspeak:difficulty"]
          ? parseFloat(cache["groundspeak:difficulty"])
          : undefined,
        terrain: terrain,
        description: description,
        url: wpt?.url ?? undefined,
        symbol: wpt?.sym ?? undefined,
        country: cache?.["groundspeak:country"] ?? undefined,
        state: cache?.["groundspeak:state"] ?? undefined,
        found,
        logs,
      } as GPXCache;
    });
}
