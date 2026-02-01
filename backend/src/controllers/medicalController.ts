import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

export const getMedicalConditionsByPerson = async (req: AuthRequest, res: Response) => {
  try {
    const { personId } = req.params;
    const userId = req.userId!;

    // Verificar que la persona pertenece al usuario
    const person = await prisma.person.findFirst({ where: { id: personId, userId } });
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const conditions = await prisma.medicalCondition.findMany({
      where: { personId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(conditions);
  } catch (error) {
    console.error('Error en getMedicalConditionsByPerson:', error);
    res.status(500).json({ error: 'Error al obtener condiciones médicas' });
  }
};

export const createMedicalCondition = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { personId, name, diagnosisDate, severity, isHereditary, notes, status } = req.body;

    // Validar campos requeridos
    if (!personId || !name) {
      return res.status(400).json({ error: 'PersonId y nombre son requeridos' });
    }

    // Verificar que la persona pertenece al usuario
    const person = await prisma.person.findFirst({ where: { id: personId, userId } });
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const condition = await prisma.medicalCondition.create({
      data: {
        personId,
        name,
        diagnosisDate: diagnosisDate ? new Date(diagnosisDate) : null,
        severity: severity || 'medium',
        isHereditary: isHereditary || false,
        notes,
        status: status || 'active',
      },
    });

    res.status(201).json(condition);
  } catch (error) {
    console.error('Error en createMedicalCondition:', error);
    res.status(500).json({ error: 'Error al crear condición médica' });
  }
};

export const updateMedicalCondition = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { name, diagnosisDate, severity, isHereditary, notes, status } = req.body;

    // Verificar que la condición pertenece a una persona del usuario
    const condition = await prisma.medicalCondition.findFirst({
      where: { id },
      include: { person: true },
    });

    if (!condition || condition.person.userId !== userId) {
      return res.status(404).json({ error: 'Condición médica no encontrada' });
    }

    const updatedCondition = await prisma.medicalCondition.update({
      where: { id },
      data: {
        name,
        diagnosisDate: diagnosisDate ? new Date(diagnosisDate) : null,
        severity,
        isHereditary,
        notes,
        status,
      },
    });

    res.json(updatedCondition);
  } catch (error) {
    console.error('Error en updateMedicalCondition:', error);
    res.status(500).json({ error: 'Error al actualizar condición médica' });
  }
};

export const deleteMedicalCondition = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verificar que la condición pertenece a una persona del usuario
    const condition = await prisma.medicalCondition.findFirst({
      where: { id },
      include: { person: true },
    });

    if (!condition || condition.person.userId !== userId) {
      return res.status(404).json({ error: 'Condición médica no encontrada' });
    }

    await prisma.medicalCondition.delete({ where: { id } });

    res.json({ message: 'Condición médica eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteMedicalCondition:', error);
    res.status(500).json({ error: 'Error al eliminar condición médica' });
  }
};