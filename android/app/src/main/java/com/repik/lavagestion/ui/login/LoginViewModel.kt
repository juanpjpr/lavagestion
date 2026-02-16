package com.repik.lavagestion.ui.login

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.repik.lavagestion.R
import com.repik.lavagestion.data.api.RetrofitClient
import com.repik.lavagestion.data.local.AuthPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class LoginUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val isLoggedIn: Boolean = false,
    val isRegisterMode: Boolean = false
)

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = AuthPreferences(application)
    private val _state = MutableStateFlow(LoginUiState())
    val state = _state.asStateFlow()

    init {
        // Check for existing session
        viewModelScope.launch {
            prefs.token.collect { token ->
                if (token != null) {
                    RetrofitClient.setToken(token)
                    _state.value = _state.value.copy(isLoggedIn = true)
                }
            }
        }
    }

    fun toggleMode() {
        _state.value = _state.value.copy(
            isRegisterMode = !_state.value.isRegisterMode,
            error = null
        )
    }

    fun login(email: String, password: String, tenantSlug: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            try {
                val request = com.repik.lavagestion.data.model.LoginRequest(email, password, tenantSlug)
                val response = RetrofitClient.api.login(request)
                RetrofitClient.setToken(response.data.token)
                prefs.saveSession(
                    token = response.data.token,
                    tenantName = response.data.tenant.name,
                    tenantSlug = response.data.tenant.slug,
                    userName = response.data.user.name
                )
                _state.value = _state.value.copy(isLoading = false, isLoggedIn = true)
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: getApplication<Application>().getString(R.string.login_error)
                )
            }
        }
    }

    fun register(tenantName: String, name: String, email: String, password: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            try {
                val request = com.repik.lavagestion.data.model.RegisterRequest(tenantName, name, email, password)
                val response = RetrofitClient.api.register(request)
                RetrofitClient.setToken(response.data.token)
                prefs.saveSession(
                    token = response.data.token,
                    tenantName = response.data.tenant.name,
                    tenantSlug = response.data.tenant.slug,
                    userName = response.data.user.name
                )
                _state.value = _state.value.copy(isLoading = false, isLoggedIn = true)
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: getApplication<Application>().getString(R.string.register_error)
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            RetrofitClient.setToken(null)
            prefs.clearSession()
            _state.value = LoginUiState()
        }
    }
}
