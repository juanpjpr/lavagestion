package com.repik.lavagestion.data.model

// ===== API Responses =====

data class ApiResponse<T>(
    val ok: Boolean,
    val data: T,
    val message: String? = null
)

data class PaginatedResponse<T>(
    val ok: Boolean,
    val data: List<T>,
    val pagination: Pagination
)

data class Pagination(
    val total: Int,
    val page: Int,
    val limit: Int,
    val totalPages: Int
)

// ===== Auth =====

data class LoginRequest(
    val email: String,
    val password: String,
    val tenantSlug: String
)

data class RegisterRequest(
    val tenantName: String,
    val name: String,
    val email: String,
    val password: String
)

data class AuthData(
    val token: String,
    val user: User,
    val tenant: Tenant
)

data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: String
)

data class Tenant(
    val id: String,
    val name: String,
    val slug: String
)

// ===== Clients =====

data class Client(
    val id: String,
    val name: String,
    val phone: String,
    val email: String? = null
)

// ===== Orders =====

data class Order(
    val id: String,
    val ticketNumber: Int,
    val status: String,
    val totalPrice: Double,
    val notes: String? = null,
    val estimatedDate: String? = null,
    val createdAt: String,
    val client: OrderClient,
    val items: List<OrderItem>
)

data class OrderClient(
    val name: String,
    val phone: String
)

data class OrderItem(
    val id: String? = null,
    val description: String,
    val quantity: Int,
    val unitPrice: Double
)

data class CreateOrderRequest(
    val clientName: String,
    val clientPhone: String,
    val items: List<OrderItemRequest>,
    val notes: String? = null
)

data class OrderItemRequest(
    val description: String,
    val quantity: Int,
    val unitPrice: Double
)

data class UpdateStatusRequest(
    val status: String
)

// ===== Reports =====

data class DailyReport(
    val date: String,
    val totalOrders: Int,
    val totalIncome: Double,
    val averageTicket: Double,
    val byStatus: StatusBreakdown
)

data class StatusBreakdown(
    val RECEIVED: Int = 0,
    val WASHING: Int = 0,
    val READY: Int = 0,
    val DELIVERED: Int = 0
)
