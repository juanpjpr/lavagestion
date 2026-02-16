package com.repik.lavagestion.ui.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.repik.lavagestion.data.api.RetrofitClient
import com.repik.lavagestion.data.model.DailyReport
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate

data class ReportsUiState(
    val report: DailyReport? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val selectedDate: String = LocalDate.now().toString()
)

class ReportsViewModel : ViewModel() {

    private val _state = MutableStateFlow(ReportsUiState())
    val state = _state.asStateFlow()

    init {
        loadReport()
    }

    fun loadReport(date: String? = null) {
        val targetDate = date ?: _state.value.selectedDate
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null, selectedDate = targetDate)
            try {
                val response = RetrofitClient.api.getDailyReport(targetDate)
                _state.value = _state.value.copy(report = response.data, isLoading = false)
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Error al cargar reporte"
                )
            }
        }
    }
}
