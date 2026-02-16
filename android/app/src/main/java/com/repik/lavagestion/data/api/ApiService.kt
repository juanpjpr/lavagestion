package com.repik.lavagestion.data.api

import com.repik.lavagestion.data.model.*
import retrofit2.http.*

interface ApiService {

    // === Auth ===
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): ApiResponse<AuthData>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): ApiResponse<AuthData>

    // === Orders ===
    @GET("orders")
    suspend fun getOrders(
        @Query("status") status: String? = null,
        @Query("search") search: String? = null,
        @Query("page") page: Int = 1
    ): PaginatedResponse<Order>

    @POST("orders")
    suspend fun createOrder(@Body request: CreateOrderRequest): ApiResponse<Order>

    @PATCH("orders/{id}/status")
    suspend fun updateOrderStatus(
        @Path("id") orderId: String,
        @Body request: UpdateStatusRequest
    ): ApiResponse<Order>

    // === Reports ===
    @GET("reports/daily")
    suspend fun getDailyReport(@Query("date") date: String? = null): ApiResponse<DailyReport>
}
