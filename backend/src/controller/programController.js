import * as programService from '../service/programService.js';

export const createProgram = async (req, res) => {
  try {
    const { title, description, target_amount, end_date, image } = req.body;

    if (!title || !target_amount) {
      return res.status(400).json({ message: "Judul dan Target Donasi wajib diisi" });
    }

    const newProgram = await programService.createProgramService({
      title,
      description,
      target_amount,
      end_date,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Program baru berhasil dibuat',
      data: newProgram
    });
  } catch (error) {
    console.error('Controller Error Create Program:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal menambah program', 
      details: error.message 
    });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await programService.getProgramByIdService(id);

    if (!program) {
      return res.status(404).json({ 
        success: false, 
        message: "Program tidak ditemukan" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: program 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await programService.getAllProgramsService();
    
    res.json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Controller Error Get Programs:', error);
    res.status(500).json({ error: 'Gagal mengambil data program' });
  }
};
export const getProgramTransactions = async (req, res) => {
  const { id } = req.params; 
  try {
    const transactions = await programService.getProgramTransactionsService(id);
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data transaksi" });
  }
};

export const updateProgram = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProgram = await programService.updateProgramService(id, req.body);

    if (!updatedProgram) {
      return res.status(404).json({ 
        success: false, 
        message: 'Program tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'Program berhasil diperbarui',
      data: updatedProgram
    });
  } catch (error) {
    console.error('Controller Error Update Program:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal memperbarui program', 
      details: error.message 
    });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Panggil service deleteProgramService
    const deletedProgram = await programService.deleteProgramService(id);

    if (!deletedProgram) {
      return res.status(404).json({ 
        success: false, 
        message: 'Program tidak ditemukan atau sudah dihapus' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Program berhasil dihapus secara permanen',
      data: deletedProgram
    });
  } catch (error) {
    console.error('Controller Error Delete Program:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal menghapus program', 
      details: error.message 
    });
  }
};