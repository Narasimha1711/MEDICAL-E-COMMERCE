const express = require('express');
const router = express.Router();
const MedicineModel = require('../models/Medicines');

// Query Planning Analysis
router.get('/analyze-queries', async (req, res) => {
    try {
        // Run search queries in parallel for better performance
        const [withoutIndex, withIndex] = await Promise.all([
            // 1. Without index (regex search)
            MedicineModel.find({ 
                name: { $regex: 'para', $options: 'i' } 
            }).explain('executionStats'),

            // 2. With index (text search)
            MedicineModel.find({ 
                $text: { $search: 'para' } 
            }).explain('executionStats')
        ]);

        // Compare performance
        res.json({
            totalDocuments: await MedicineModel.countDocuments(),
            withoutIndex: {
                method: 'Collection Scan (Regex)',
                executionTimeMs: withoutIndex.executionStats.executionTimeMillis,
                docsExamined: withoutIndex.executionStats.totalDocsExamined,
                docsReturned: withoutIndex.executionStats.nReturned,
                indexUsed: withoutIndex.queryPlanner.winningPlan.inputStage?.indexName || 'COLLSCAN'
            },
            withIndex: {
                method: 'Text Index',
                executionTimeMs: withIndex.executionStats.executionTimeMillis,
                docsExamined: withIndex.executionStats.totalDocsExamined,
                docsReturned: withIndex.executionStats.nReturned,
                indexUsed: withIndex.queryPlanner.winningPlan.inputStage?.indexName || 'COLLSCAN'
            },
            analysis: {
                timeImprovement: withoutIndex.executionStats.executionTimeMillis - withIndex.executionStats.executionTimeMillis,
                docsExaminedDifference: withoutIndex.executionStats.totalDocsExamined - withIndex.executionStats.totalDocsExamined
            }
        });
    } catch (error) {
        console.error('Error in query analysis:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
