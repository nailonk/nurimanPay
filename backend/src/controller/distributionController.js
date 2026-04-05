import * as distributionService from '../service/distributionService.js';

export const createDistribution = async (req, res) => {
    try {
        const { program_id, purpose, amount, description, image, distributed_at} = req.body;

        if (!program_id || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Program ID dan nominal wajib diisi, nominal harus lebih dari 0'
            });
        }
        
        const result = await distributionService.createDistributionService({
            program_id, purpose, amount, description, image, distributed_at
        });

        if (result.error === 'PROGRAM_NOT_FOUND') {
            return res.status(404).json({ success: false, error: 'Program tidak ditemukan' });
        }

        if (result.error === 'INSUFFICIENT_FUNDS') {
            return res.status(400).json({
                success: false,
                error: `Dana tidak mencukupi. Sisa dana: Rp ${result.sisaDana.toLocaleString()}`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Laporan penyaluran berhasil ditambahkan',
            data: result.data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllDistributions = async (req, res) => {
    try {
        const data = await distributionService.getAllDistributionsService();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getDistributionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await distributionService.getDistributionByIdService(id);

        if (!data) {
            return res.status(404).json({ success: false, error: 'Distribusi tidak ditemukan' });
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDistributionsByProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const data = await distributionService.getDistributionsByProgramService(programId);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProgramSummary = async (req, res) => {
    try {
        const { programId } = req.params;
        const data = await distributionService.getProgramSummaryService(programId);

        if (!data) {
            return res.status(404).json({ success: false, error: 'Program tidak ditemukan' });
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateDistribution = async (req, res) => {
    try {
        const { id } = req.params;
        const { program_id, purpose, amount, description, image, distributed_at } = req.body;

        const result = await distributionService.updateDistributionService(id, {
            program_id, purpose, amount, description, image, distributed_at
        });

        if (!result) {
            return res.status(404).json({ success: false, error: 'Distribusi tidak ditemukan' });
        }

        if (result.error === 'INSUFFICIENT_FUNDS') {
            return res.status(400).json({
                success: false,
                error: `Dana tidak mencukupi. Sisa dana: Rp ${result.sisaDana.toLocaleString('id-ID')}`
            });
        }

        res.json({ success: true, message: 'Laporan berhasil diupdate', data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteDistribution = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await distributionService.deleteDistributionService(id);

        if (!data) {
            return res.status(404).json({ success: false, error: 'Distribusi tidak ditemukan' });
        }

        res.json({ success: true, message: 'Laporan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
