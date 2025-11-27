import Story from "../models/Story.models.js";

export async function archiveExpiredStories({ batchSize = 1000 } = {}) {
  const now = new Date();
  let processed = 0;
  let archivedCount = 0;

  while (true) {    
    const candidates = await Story.find(
      {
        isArchived: false,            
        expiresAt: { $lte: now },
      },
      { _id: 1 }                        
    )
      .sort({ _id: 1 })
      .limit(batchSize)
      .lean();

    if (!candidates.length) break;

    const ids = candidates.map((d) => d._id);

    const result = await Story.updateMany(
      { _id: { $in: ids }, isArchived: false }, 
      { $set: { isArchived: true, archivedAt: now } }
    );

    processed += ids.length;
    archivedCount += result.modifiedCount || 0;

    if (ids.length < batchSize) break;
  }

  return { processed, archivedCount, timestamp: now.toISOString() };
}
