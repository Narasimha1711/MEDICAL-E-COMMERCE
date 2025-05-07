const express = require('express');
const router = express.Router();
const MedicineModel = require('../models/Medicines');

// Query Planning Analysis Function
const analyzeMedicineQueries = async (req, res) => {
    try {
        // 1. Simple find query plan
        const basicQueryPlan = await MedicineModel.find({ category: 'Pain Relief' })
            .explain('executionStats');

        // 2. Complex query plan with sorting and filtering
        const complexQueryPlan = await MedicineModel.find({
            price: { $lt: 1000 },
            stock: { $gt: 0 }
        })
            .sort({ price: -1 })
            .explain('executionStats');

        // 3. Text search query plan
        const searchQueryPlan = await MedicineModel.find({
            $text: { $search: "paracetamol" }
        })
            .explain('executionStats');

        res.json({
            basicQueryPlan: {
                executionTimeMillis: basicQueryPlan.executionStats.executionTimeMillis,
                totalDocsExamined: basicQueryPlan.executionStats.totalDocsExamined,
                indexesUsed: basicQueryPlan.queryPlanner.winningPlan.inputStage?.indexName || 'COLLSCAN'
            },
            complexQueryPlan: {
                executionTimeMillis: complexQueryPlan.executionStats.executionTimeMillis,
                totalDocsExamined: complexQueryPlan.executionStats.totalDocsExamined,
                indexesUsed: complexQueryPlan.queryPlanner.winningPlan.inputStage?.indexName || 'COLLSCAN'
            },
            searchQueryPlan: {
                executionTimeMillis: searchQueryPlan.executionStats.executionTimeMillis,
                totalDocsExamined: searchQueryPlan.executionStats.totalDocsExamined,
                indexesUsed: searchQueryPlan.queryPlanner.winningPlan.inputStage?.indexName || 'COLLSCAN'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Query Planning Analysis Route
router.get('/analyze-queries', analyzeMedicineQueries);

module.exports = router;
