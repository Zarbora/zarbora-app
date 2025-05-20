import { PostgrestError } from "@supabase/supabase-js";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleSupabaseError(error: PostgrestError): never {
  throw new ApiError(
    error.message,
    error.code === "PGRST116" ? 404 : 500,
    error
  );
}
