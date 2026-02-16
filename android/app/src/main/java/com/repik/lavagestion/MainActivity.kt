package com.repik.lavagestion

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import com.repik.lavagestion.ui.login.LoginScreen
import com.repik.lavagestion.ui.login.LoginViewModel
import com.repik.lavagestion.ui.navigation.MainApp
import com.repik.lavagestion.ui.theme.LavagestionTheme

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            LavagestionTheme {
                val loginViewModel: LoginViewModel = viewModel()
                val loginState by loginViewModel.state.collectAsState()

                if (loginState.isLoggedIn) {
                    MainApp(loginViewModel = loginViewModel)
                } else {
                    LoginScreen(viewModel = loginViewModel)
                }
            }
        }
    }
}
