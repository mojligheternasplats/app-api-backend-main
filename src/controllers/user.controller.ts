import { Request, Response } from "express";
import { UserService } from "../services/user.service";



export const getAllUsers = async (req: Request, res: Response) => {

  try {
    const users = await UserService.getAllUsers();

    // Optional: add pagination logic here if needed
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || users.length;
    const start = (page - 1) * limit;
    const paginated = users.slice(start, start + limit);

    res.json({
      data: paginated,
      total: users.length,
      page,
      limit,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {


  try {
    const updated = await UserService.updateUser(req.params.id, req.body);
  
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;


    await UserService.deleteUser(userId);
    res.json({ message: "User deleted" });
  } catch (error: any) {
    console.error("Delete error:", error); // ✅ log full error
    res.status(500).json({ error: error.message }); // ✅ return correct status
  }
};


