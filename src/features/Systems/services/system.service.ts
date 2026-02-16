import { CreateSystemInput, CreatorIdentifier, SystemIdentifier, UpdateSystemInput } from "@/schema";
import { createSystem, updateSystem } from "../repos/system.repo";

export async function createCompanySystem(creator: CreatorIdentifier, data: CreateSystemInput) {
    const { id } = creator

    return await createSystem(id, data)
    
}

export async function updateCompanySystem(system: SystemIdentifier, data: UpdateSystemInput) {
    const { id } = system

    return await updateSystem(id, data)
}