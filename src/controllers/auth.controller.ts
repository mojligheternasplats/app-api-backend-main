import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log(email)
    const result = await AuthService.register(email, password, firstName, lastName);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    console.error(error);

    const code = error.code || error.message;

    if (code === "EMAIL_NOT_FOUND") {
      return res.status(404).json({ error: "EMAIL_NOT_FOUND" });
    }

    if (code === "WRONG_PASSWORD") {
      return res.status(401).json({ error: "WRONG_PASSWORD" });
    }

    res.status(400).json({ error: "UNKNOWN_ERROR" });
  }
};
export const me = async (req: AuthRequest, res: Response) => {
  try {
    // req.user comes from auth middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const user = await UserRepository.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Remove password from response
    const { password, ...safeUser } = user;

    res.json(safeUser);
  } catch (error: any) {
    res.status(500).json({ error: "FAILED_TO_FETCH_PROFILE" });
  }
};
